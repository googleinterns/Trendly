import com.google.protobuf.TextFormat.ParseException;
import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

/**
 * Calls trends API wrapper for each interval according to the given restriction and returns the
 * data in the right format.
 */
public class HistogramyDataRetrieval {
  public static final int MAX_TOPICS = 8;
  public static final String SEPERATOR = "-";
  public static final int NUM_OF_MONTHES = 12;
  public static final String UNTIT_DATE = " - ";

  public static List<HistogramTopic> getInitialTopicsList(
      String term,
      String startDate,
      String endDate,
      String country,
      String interval,
      String category,
      String funcName)
      throws Exception {
    ArrayList<DateRange> dates =
        dateProcessing(startDate, endDate, getIntervalForTopics(startDate, endDate));
    return createTopicsList(dates, country, term, category, funcName);
  }

  /**
   * The main function which called from the servlets. Gets the restrictions and returns the data to
   * the servlet.
   *
   * @param term - The search term wished to be explored.
   * @param startDate- The start of requested time range should be a month and a year in the format
   *     YYYY-MM.
   * @param endDate- The end of requested time range should be a month and a year in the format
   *     YYYY-MM.
   * @param country - The location restriction for the search, in ISO-3166-2 format.
   * @param interval
   * @param funcName - The requested function name on Trends API (topTopics, risingTopics).
   * @return A map between topic object to its TrendsGraphResult.
   */
  public static Map<HistogramTopic, TrendsGraphResult> getDataForTopics(
      String term,
      String startDate,
      String endDate,
      String country,
      String interval,
      String category,
      String funcName,
      List<HistogramTopic> topics)
      throws Exception {
    if (topics.size() > 0) {
      updateTopicsDescription(topics);
      return mapTopicToGraph(topics, startDate, endDate, country, category);
    }
    return new HashMap<HistogramTopic, TrendsGraphResult>();
  }

  /**
   * Calculates and returns the size of the interval for defining the topics' query granularity (the
   * amount of month in the given period of time divided by MAX_TOPICS).
   */
  private static int getIntervalForTopics(String startDate, String endDate) throws ParseException {
    LocalDate start = LocalDate.parse(startDate + "-01", DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    LocalDate end = LocalDate.parse(endDate + "-01", DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    return Math.max(Period.between(start, end).getMonths() / MAX_TOPICS, 1);
  }

  /**
   * Returns list of time ranges to do the API call on them (given start date, end date and interval
   * in monthes).
   *
   * @param startDate
   * @param endDate
   * @param interval
   * @return List of date ranges.
   */
  static ArrayList<DateRange> dateProcessing(String startDate, String endDate, int interval) {
    String[] startDateSplit = startDate.split(SEPERATOR);
    String[] endDateSplit = endDate.split(SEPERATOR);
    int currentYear = Integer.parseInt(startDateSplit[0]);
    int currentMonth = Integer.parseInt(startDateSplit[1]);

    int endYear = Integer.parseInt(endDateSplit[0]);
    int endMonth = Integer.parseInt(endDateSplit[1]);

    ArrayList<DateRange> ranges = new ArrayList<>();

    while (currentYear < endYear || (currentYear == endYear && currentMonth <= endMonth)) {
      int endOfIntervalMonth = currentMonth + interval - 1;
      int endOfIntervalYear = currentYear;
      // In case the interval is more than 1 year.
      if (endOfIntervalMonth > NUM_OF_MONTHES) {
        endOfIntervalYear +=
            endOfIntervalMonth % NUM_OF_MONTHES == 0
                ? (endOfIntervalMonth / NUM_OF_MONTHES) - 1
                : endOfIntervalMonth / NUM_OF_MONTHES;
        endOfIntervalMonth =
            endOfIntervalMonth % NUM_OF_MONTHES == 0
                ? NUM_OF_MONTHES
                : endOfIntervalMonth % NUM_OF_MONTHES;
      }
      // Check out of range.
      if (endOfIntervalYear > endYear
          || (endOfIntervalYear == endYear && endOfIntervalMonth > endMonth)) {
        endOfIntervalMonth = endMonth;
        endOfIntervalYear = endYear;
      }

      DateRange newDR =
          new DateRange(
              currentYear + SEPERATOR + currentMonth,
              endOfIntervalYear + SEPERATOR + endOfIntervalMonth);
      ranges.add(newDR);
      currentYear = endOfIntervalYear;
      currentMonth = endOfIntervalMonth + 1;
      if (currentMonth > NUM_OF_MONTHES) {
        currentMonth = currentMonth % NUM_OF_MONTHES;
        currentYear++;
      }
    }
    return ranges;
  }

  /**
   * Returns a filtered (based on top volume) list of HistogramTopic based on the given function
   * name (rising/top) and restrictions.
   */
  private static List<HistogramTopic> createTopicsList(
      ArrayList<DateRange> dates, String country, String term, String category, String funcName)
      throws IOException, InterruptedException, ExecutionException {
    ExecutorService executor = Executors.newFixedThreadPool(dates.size());
    List<Future<TrendsResult>> topicsResults = new ArrayList<>();
    for (DateRange date : dates) {
      Callable<TrendsResult> callable =
          new TrendsCallable(funcName, term, country, date.getStart(), date.getEnd(), category);
      topicsResults.add(executor.submit(callable));
    }
    executor.shutdown();
    return new ArrayList<>(getTopicsFromThreads(topicsResults));
  }

  /**
   * Extracts the TrendsHistogramResult from the given Future list and returns a set of topics.
   *
   * @param topicsResults - List of Future<TrendsResult> with TrendsHistogramResult.
   */
  private static Set<HistogramTopic> getTopicsFromThreads(List<Future<TrendsResult>> topicsResults)
      throws InterruptedException, ExecutionException {
    Set<HistogramTopic> topics = new HashSet<>();
    for (Future<TrendsResult> res : topicsResults) {
      TrendsHistogramResult topicsResult = (TrendsHistogramResult) res.get();
      if (topicsResult.getItem() != null) {
        for (TrendsTopic topic : topicsResult.getItem()) {
          topics.add(handleTopic(topic));
        }
      }
    }
    return topics;
  }

  /** Returns Histogram topic given trends topic objects. The new topic containing description. */
  static HistogramTopic handleTopic(TrendsTopic topic) {
    HistogramTopic newTopic = new HistogramTopic();
    // Default
    newTopic.description = "";
    newTopic.title = topic.title;
    newTopic.value = topic.value;
    newTopic.mid = topic.mid;
    return newTopic;
  }

  /** Returns a list of up to MAX_TOPICS topics with the highest volume from the given set. */
  private static List<HistogramTopic> filterTopics(Set<HistogramTopic> topics) {
    return topics.stream()
        .sorted(Collections.reverseOrder(Comparator.comparing(HistogramTopic::getValue)))
        .collect(Collectors.toList())
        .subList(0, Math.min(topics.size(), MAX_TOPICS));
  }

  /** Updates the description property of each topic in the given list using KG API. */
  private static void updateTopicsDescription(List<HistogramTopic> topics) {
    ExecutorService executor = Executors.newFixedThreadPool(topics.size());
    Map<String, Future<String>> midToDescription = new HashMap<>();
    for (HistogramTopic topic : topics) {
      Callable<String> callable = new KGCallable(topic.mid);
      midToDescription.put(topic.mid, executor.submit(callable));
    }
    executor.shutdown();
    getDescriptionFromThreads(topics, midToDescription);
  }

  /** Extracts the description from the given Future list and updates topics. */
  private static void getDescriptionFromThreads(
      List<HistogramTopic> topics, Map<String, Future<String>> midToDescription) {
          System.out.println("KG!!!!!");
    topics.parallelStream()
        .forEach(
            (topic) -> {
              try {
                topic.description = midToDescription.get(topic.mid).get();
              } catch (InterruptedException | ExecutionException e) {
                  System.out.println("KG Failed!!!!!");
                throw new Error(e);
              }
            });
  }
  /** Returns a map between a topic object to its trends graph result. */
  private static Map<HistogramTopic, TrendsGraphResult> mapTopicToGraph(
      List<HistogramTopic> topics,
      String startDate,
      String endDate,
      String country,
      String category) {
    Map<HistogramTopic, Future<TrendsResult>> graphResults = new HashMap<>();
    ExecutorService executor = Executors.newFixedThreadPool(topics.size());
    topics.parallelStream()
        .forEach(
            (topic) -> {
              Callable<TrendsResult> callable =
                  new TrendsCallable(
                      TrendsFunctions.GET_GRAPH,
                      topic.title,
                      country,
                      startDate,
                      endDate,
                      category);
              graphResults.put(topic, executor.submit(callable));
            });
    executor.shutdown();
    return getGraphsFromThreads(graphResults);
  }
  /** Extracts the TrendsGraphResult from the given Future map and returns a topic to graph map. */
  private static Map<HistogramTopic, TrendsGraphResult> getGraphsFromThreads(
      Map<HistogramTopic, Future<TrendsResult>> graphResults) {
    Map<HistogramTopic, TrendsGraphResult> topicsToGraph = new HashMap<>();
    graphResults.entrySet().parallelStream()
        .forEach(
            (entry) -> {
              TrendsGraphResult graphResult;
              try {
                graphResult = (TrendsGraphResult) entry.getValue().get();
              } catch (InterruptedException | ExecutionException e) {
                throw new Error(e);
              }
              topicsToGraph.put(entry.getKey(), graphResult);
            });
    return topicsToGraph;
  }
}
