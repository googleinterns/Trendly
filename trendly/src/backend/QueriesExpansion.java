import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * A class that handles expansion of given terms to clustered related queries (currently, the
 * "clusters" are the topic with their related queries)
 */
public class QueriesExpansion {
  public static final int MAX_CLUSTERS = 8;
  public static final int MAX_QUERIES = 50;

  /**
   * Receives list of terms and time + location restrictions and returns list of Cluster objects
   * with clusters of queries related to the given term that were serched on the given location in
   * the given time.
   *
   * @param terms - list of terms wished to be explored.
   * @param location - The location restriction for the search, in ISO-3166-2 format.
   * @param startDate - The start of requested time range should be a month and a year in the format
   *     YYYY-MM.
   * @param endDate - The end of requested time range should be a month and a year in the format
   *     YYYY-MM.
   * @return List of Cluster objects (with clusters of queries related to the v)
   * @throws IOException
   */
  public static List<Cluster> getAllClusters(
      String[] terms, String location, String startDate, String endDate)
      throws IOException, InterruptedException, ExecutionException {
    if (terms.length == 0) {
      return new ArrayList<Cluster>();
    }
    Set<String> topics = QueriesExpansion.getTopTopics(terms, location, startDate, endDate);
    return topicQueryProcess(topics, location, startDate, endDate);
  }

  /** Expands the given terms to related top topics and returns a set of topics titles. */
  private static Set<String> getTopTopics(
      String[] terms, String location, String startDate, String endDate)
      throws IOException, InterruptedException, ExecutionException {
    int max_related_topics = MAX_CLUSTERS / terms.length;
    ExecutorService executor = Executors.newFixedThreadPool(terms.length);
    List<Future<TrendsResult>> topicsResults = new ArrayList<>();
    for (String term : terms) {
      Callable<TrendsResult> callable =
          new TrendsCallable(TrendsFunctions.TOP_TOPICS, term, location, startDate, endDate);
      topicsResults.add(executor.submit(callable));
    }
    executor.shutdown();
    return getTopicsFromThreads(topicsResults, max_related_topics);
  }

  /**
   * Extracts the TrendsTopicsResult from the given Future list and eturns a set of topics titles
   *
   * @param topicsResults - List of Future<TrendsResults> with TrendsTopicsResult objects results
   *     from threads.
   * @param max_related_topics - max amount of topics per result
   */
  private static Set<String> getTopicsFromThreads(
      List<Future<TrendsResult>> topicsResults, int max_related_topics)
      throws InterruptedException, ExecutionException {
    Set<String> topics = new HashSet<>();
    for (Future<TrendsResult> res : topicsResults) {
      TrendsTopicsResult topicsResult = (TrendsTopicsResult) res.get();
      if (topicsResult.item != null) {
        Iterator<TrendsTopic> topicsIter = Arrays.stream(topicsResult.item).iterator();
        int i = 0;
        while (topicsIter.hasNext() && i < max_related_topics) {
          if (topics.add(topicsIter.next().title)) {
            i++;
          }
        }
      }
    }
    return topics;
  }

  /**
   * Receives Set of topics and time + place restrictions and returns list of Cluster objects
   * containing queries related to the topics.
   */
  private static List<Cluster> topicQueryProcess(
      Set<String> topics, String location, String startDate, String endDate)
      throws IOException, InterruptedException, ExecutionException {
    int max_related_queries = MAX_QUERIES / topics.size();
    ExecutorService executor = Executors.newFixedThreadPool(topics.size());

    Map<String, Future<TrendsResult>> queriesResults = new HashMap<>();
    topics.parallelStream()
        .forEach(
            (topic) -> {
              Callable<TrendsResult> callable =
                  new TrendsCallable(
                      TrendsFunctions.TOP_QUERIES, topic, location, startDate, endDate);
              queriesResults.put(topic, executor.submit(callable));
            });
    executor.shutdown();
    return getClustersFromThreads(queriesResults, max_related_queries);
  }

  /**
   * Extracts the TrendsQueriesResult from the given Future list and returns list of Cluster objects
   *
   * @param queriesResults - a map between topic title to its related queries Future<TrendsResult>
   *     result
   * @param max_related_queries - max amount of queries per result.
   */
  private static List<Cluster> getClustersFromThreads(
      Map<String, Future<TrendsResult>> queriesResults, int max_related_queries) {
    List<Cluster> clusters = new ArrayList<>();
    AtomicInteger id = new AtomicInteger(1);
    queriesResults.entrySet().parallelStream()
        .forEach(
            (entry) -> {
              TrendsQueriesResult queriesResult;
              try {
                queriesResult = (TrendsQueriesResult) entry.getValue().get();
              } catch (InterruptedException | ExecutionException e) {
                throw new Error(e);
              }
              if (queriesResult.item != null) {
                TrendsQuery[] trendsQueries =
                    Arrays.copyOfRange(
                        queriesResult.item,
                        0,
                        Math.min(max_related_queries, queriesResult.item.length));
                clusters.add(new Cluster(entry.getKey(), id.getAndIncrement(), trendsQueries));
              }
            });
    return clusters;
  }
}
