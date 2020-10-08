import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * A class that handles expansion of given terms to clustered related queries (currently, the
 * "clusters" are the topic with their related queries)
 */
public class QueriesExpansion {
  public static final int MAX_CLUSTERS = 7;
  public static final int MAX_QUERIES = 40;

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
      String[] terms, String location, String startDate, String endDate) throws IOException {
    if (terms.length == 0) {
      return new ArrayList<Cluster>();
    }
    Set<String> topics = QueriesExpansion.getTopTopics(terms, location, startDate, endDate);
    return topicQueryProcess(topics, location, startDate, endDate);
  }

  /** Expands the given terms to related top topics and returns a set of topics titles. */
  private static Set<String> getTopTopics(
      String[] terms, String location, String startDate, String endDate) throws IOException {
    int max_related_topics = MAX_CLUSTERS / terms.length;
    Set<String> topics = new HashSet<>();
    for (String term : terms) {
      TrendsTopicsResult topicsResult =
          (TrendsTopicsResult)
              TrendsAPIWrapper.fetchDataFromTrends(
                  TrendsFunctions.TOP_TOPICS, term, location, startDate, endDate);
      if (topicsResult.item != null) {
        TrendsTopic[] trendsTopics = Arrays.copyOfRange(topicsResult.item, 0, max_related_topics);
        for (TrendsTopic topic : trendsTopics) {
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
      Set<String> topics, String location, String startDate, String endDate) throws IOException {
    int max_related_queries = MAX_QUERIES / topics.size();
    List<Cluster> clusters = new ArrayList<>();
    int i = 1;
    for (String topic : topics) {
      TrendsQueriesResult queriesResult =
          (TrendsQueriesResult)
              TrendsAPIWrapper.fetchDataFromTrends(
                  TrendsFunctions.TOP_QUERIES, topic, location, startDate, endDate);
      if (queriesResult.item != null) {
        TrendsQuery[] trendsQueries =
            Arrays.copyOfRange(queriesResult.item, 0, max_related_queries);
        clusters.add(new Cluster(topic, i, trendsQueries));
        i++;
      }
    }
    return clusters;
  }
}
