import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
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
import java.util.concurrent.atomic.AtomicInteger;

/**
 * A class that handles expansion of given terms to clustered related queries (currently, the
 * "clusters" are the topic with their related queries)
 */
public class QueriesExpansion {
  public static final int MAX_QUERIES = 8;

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
      String[] terms, String location, String startDate, String endDate, String category)
      throws IOException, InterruptedException, ExecutionException {
    List<Cluster> clusters =
        terms.length == 0
            ? new ArrayList<Cluster>()
            : topicQueryProcess(
                QueriesExpansion.getTopTopics(terms, location, startDate, endDate, category),
                location,
                startDate,
                endDate,
                category);
    Similarity.updateClustersSimilarity(clusters);
    return clusters;
  }

  /** Expands the given terms to related top topics and returns a set of topics titles. */
  private static Set<String> getTopTopics(
      String[] terms, String location, String startDate, String endDate, String category)
      throws IOException, InterruptedException, ExecutionException {
    ExecutorService executor = Executors.newFixedThreadPool(terms.length);
    List<Future<TrendsResult>> topicsResults = new ArrayList<>();
    for (String term : terms) {
      Callable<TrendsResult> callable =
          new TrendsCallable(
              TrendsFunctions.TOP_TOPICS, term, location, startDate, endDate, category);
      topicsResults.add(executor.submit(callable));
    }
    executor.shutdown();
    return getTopicsFromThreads(topicsResults);
  }

  /**
   * Extracts the TrendsTopicsResult from the given Future list and eturns a set of topics titles
   *
   * @param topicsResults - List of Future<TrendsResults> with TrendsTopicsResult objects results
   *     from threads.
   * @param max_related_topics - max amount of topics per result
   */
  private static Set<String> getTopicsFromThreads(List<Future<TrendsResult>> topicsResults)
      throws InterruptedException, ExecutionException {
    Set<String> topics = new HashSet<>();
    for (Future<TrendsResult> res : topicsResults) {
      TrendsTopicsResult topicsResult = (TrendsTopicsResult) res.get();
      if (topicsResult.item != null) {
        for (TrendsTopic topic : topicsResult.item) {
          topics.add(topic.title);
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
      Set<String> topics, String location, String startDate, String endDate, String category)
      throws IOException, InterruptedException, ExecutionException {
    ExecutorService executor = Executors.newFixedThreadPool(topics.size());

    Map<String, Future<TrendsResult>> queriesResults = new HashMap<>();
    topics.parallelStream()
        .forEach(
            (topic) -> {
              Callable<TrendsResult> callable =
                  new TrendsCallable(
                      TrendsFunctions.TOP_QUERIES, topic, location, startDate, endDate, category);
              queriesResults.put(topic, executor.submit(callable));
            });
    executor.shutdown();
    return getClustersFromThreads(queriesResults);
  }

  /**
   * Extracts the TrendsQueriesResult from the given Future list and returns list of Cluster
   * objects.
   *
   * @param queriesResults - a map between topic title to its related queries Future<TrendsResult>
   *     result
   * @param max_related_queries - max amount of queries per result.
   */
  private static List<Cluster> getClustersFromThreads(
      Map<String, Future<TrendsResult>> queriesResults) {
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
                clusters.add(createNewCluster(queriesResult.item, id, entry.getKey()));
              }
            });
    return clusters;
  }

  /** Returns the clustr's volume (sum of queries volume). */
  private static double calculateClusterVolume(TrendsQuery[] queries) {
    return Arrays.stream(queries).mapToDouble((query) -> query.value).sum();
  }

  /** Returns new cluster object based on the giben queries, id and title. */
  private static Cluster createNewCluster(TrendsQuery[] queries, AtomicInteger id, String title) {
    double volume = calculateClusterVolume(queries);
    TrendsQuery[] queriesToDisplay =
        Arrays.copyOfRange(queries, 0, Math.min(MAX_QUERIES, queries.length));
    TrendsQuery[] additionalQueries =
        Arrays.copyOfRange(queries, Math.min(MAX_QUERIES, queries.length), queries.length);
    return new Cluster(title, id.getAndIncrement(), volume, queriesToDisplay, additionalQueries);
  }
}
