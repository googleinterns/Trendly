import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class QueriesExpansionTest {
  // Restrictions
  private static final String[] EMPTY_TERMS = {};
  private static final String[] TERMS = {"google", "happy"};
  private static final String[] TERMS2 = {"apple", "banana", "grapes"};
  private static final String[] TERMS3 = {
    "New York", "Las Vegas", "Washington", "Los Angeles", "Las Vegas"
  };
  private static final String LOCATION = "US";
  private static final String START_DATE = "2016-08";
  private static final String END_DATE = "2020-08";

  /**
   * Checks the returned clusters amount from getAllClusters with 2 given terms <= MAX_CLUSTERS
   *
   * @throws ExecutionException
   * @throws InterruptedException
   */
  @Test
  public void maxClustersWith2Terms() throws IOException, InterruptedException, ExecutionException {
    List<Cluster> clusters = QueriesExpansion.getAllClusters(TERMS, LOCATION, START_DATE, END_DATE);
    Assert.assertTrue(clusters.size() <= QueriesExpansion.MAX_CLUSTERS);
  }

  /** Checks the returned clusters amount from getAllClusters with 3 given terms <= MAX_CLUSTERS */
  @Test
  public void maxClustersWith3Terms() throws IOException, InterruptedException, ExecutionException {
    List<Cluster> clusters =
        QueriesExpansion.getAllClusters(TERMS2, LOCATION, START_DATE, END_DATE);
    Assert.assertTrue(clusters.size() <= QueriesExpansion.MAX_CLUSTERS);
  }

  /** Checks the returned clusters amount from getAllClusters with 5 given terms <= MAX_CLUSTERS */
  @Test
  public void maxClustersWith5Terms() throws IOException, InterruptedException, ExecutionException {
    List<Cluster> clusters =
        QueriesExpansion.getAllClusters(TERMS3, LOCATION, START_DATE, END_DATE);
    Assert.assertTrue(clusters.size() <= QueriesExpansion.MAX_CLUSTERS);
  }

  private static int countQueries(List<Cluster> clusters) {
    int counter = 0;
    for (Cluster cluster : clusters) {
      counter += cluster.queries.length;
    }
    return counter;
  }

  /**
   * Checks the returned queries amount in clusters from getAllClusters with 2 given terms <=
   * MAX_QUERIES
   */
  @Test
  public void maxQueriesWith2Terms() throws IOException, InterruptedException, ExecutionException {
    List<Cluster> clusters = QueriesExpansion.getAllClusters(TERMS, LOCATION, START_DATE, END_DATE);
    Assert.assertTrue(countQueries(clusters) <= QueriesExpansion.MAX_QUERIES);
  }

  /**
   * Checks the returned queries amount in clusters from getAllClusters with 3 given terms <=
   * MAX_QUERIES
   */
  @Test
  public void maxQueriesWith3Terms() throws IOException, InterruptedException, ExecutionException {
    List<Cluster> clusters =
        QueriesExpansion.getAllClusters(TERMS2, LOCATION, START_DATE, END_DATE);
    Assert.assertTrue(countQueries(clusters) <= QueriesExpansion.MAX_QUERIES);
  }

  /**
   * Checks the returned queries amount in clusters from getAllClusters with 5 given terms <=
   * MAX_QUERIES
   */
  @Test
  public void maxQueriesWith5Terms() throws IOException, InterruptedException, ExecutionException {
    List<Cluster> clusters =
        QueriesExpansion.getAllClusters(TERMS3, LOCATION, START_DATE, END_DATE);
    Assert.assertTrue(countQueries(clusters) <= QueriesExpansion.MAX_QUERIES);
  }

  /** Checks getAllClusters returns empty list when the given terms list is empty */
  @Test
  public void emptyTerms() throws IOException, InterruptedException, ExecutionException {
    List<Cluster> clusters =
        QueriesExpansion.getAllClusters(EMPTY_TERMS, LOCATION, START_DATE, END_DATE);
    Assert.assertTrue(clusters.isEmpty());
  }
}
