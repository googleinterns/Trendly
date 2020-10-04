import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;

/**
 * Calls trends API wrapper for each interval according to the given restriction and returns the
 * data in the right format.
 */
public class HistogramyDataRetrieval {
  public static final int MAX_TOPICS = 5;
  public static final String SEPERATOR = "-";
  public static final int NUM_OF_MONTHES = 12;
  public static final String UNTIT_DATE = " - ";

  /**
   * The main function which called from the servlets. Gets thr restrictions and returns the
   * data to the servlet.
   * @param term
   * @param startDate
   * @param endDate
   * @param country
   * @param interval
   * @param funcName
   * @return The data according the given restrictions in the right format.
   * @throws NumberFormatException
   * @throws IOException
   */
  public static LinkedHashMap<String, ArrayList<HistogramTopic>> getDataForServlet(String term,
      String startDate, String endDate, String country, String interval, String funcName)
      throws NumberFormatException, IOException {
    ArrayList<DateRange> dates = dateProcessing(startDate, endDate, Integer.parseInt(interval));
    LinkedHashMap<String, ArrayList<HistogramTopic>> results = new LinkedHashMap<>();
    for (DateRange date : dates) {
      results.put(date.getStart() + " : " + date.getEnd(),
          retriveDataFromApi(date, country, term, funcName));
    }
    return results;
  }

  /**
   * Returns list of time ranges to do the API call on them (given start date, end date and interval
   * in monthes).
   * @param startDate
   * @param endDate
   * @param interval
   * @return List of date ranges.
   */
  static ArrayList<DateRange> dateProcessing(String startDate, String endDate, int interval) {
    int currentYear = Integer.parseInt(startDate.split(SEPERATOR)[0]);
    int currentMonth = Integer.parseInt(startDate.split(SEPERATOR)[1]);

    int endYear = Integer.parseInt(endDate.split(SEPERATOR)[0]);
    int endMonth = Integer.parseInt(endDate.split(SEPERATOR)[1]);

    ArrayList<DateRange> ranges = new ArrayList<>();

    while (currentYear < endYear || (currentYear == endYear && currentMonth <= endMonth)) {
      int endOfIntervalMonth = currentMonth + interval - 1;
      int endOfIntervalYear = currentYear;
      // in case the interval is more than 1 year
      while (endOfIntervalMonth > NUM_OF_MONTHES) {
        endOfIntervalMonth = endOfIntervalMonth - NUM_OF_MONTHES;
        endOfIntervalYear++;
      }
      // check out of range
      if (endOfIntervalYear > endYear
          || (endOfIntervalYear == endYear && endOfIntervalMonth > endMonth)) {
        endOfIntervalMonth = endMonth;
        endOfIntervalYear = endYear;
      }

      DateRange newDR = new DateRange(currentYear + SEPERATOR + currentMonth,
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
   * Calls trends API wrapper and run over the topics results to handle each one by calling KG
   * graph.
   * @param date
   * @param country
   * @param term
   * @param funcName
   * @return List of Histogram topics.
   * @throws IOException
   */
  static ArrayList<HistogramTopic> retriveDataFromApi(
      DateRange date, String country, String term, String funcName) throws IOException {
    ArrayList<HistogramTopic> allTopics = new ArrayList<HistogramTopic>();
    TrendsHistogramResult allAPITopics =
        (TrendsHistogramResult) TrendsAPIWrapper.fetchDataFromTrends(
            funcName, term, country, date.getStart(), date.getEnd());
    if (allAPITopics.getItem() != null) {
      int counter = 0;
      for (TrendsTopic topic : allAPITopics.getItem()) {
        if (counter > MAX_TOPICS) {break;}
        allTopics.add(handleTopic(topic));
        counter++;
      }
    }
    return allTopics;
  }

  /**
   * Returns Histogram topic given trends topic objects. The new topic containing description.
   * @param topic
   * @return
   */
  static HistogramTopic handleTopic(TrendsTopic topic) {
    HistogramTopic newTopic = new HistogramTopic();
    // TO BE ADDED : calls KG graph in order to extract the description
    newTopic.description = "description from KG will be added";
    newTopic.title = topic.title;
    newTopic.value = topic.value;
    newTopic.mid = topic.mid;
    return newTopic;
  }
}
