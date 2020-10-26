import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class SimilarityTest {
  private static final TrendsQuery[] QUERIES1 = {
    new TrendsQuery("I love summer", 10), new TrendsQuery("banana apple grapes watermelon", 10)
  };
  private static final TrendsQuery[] QUERIES2 = {
    new TrendsQuery("I LOVE SUMMER", 10), new TrendsQuery("BANANA APPLE GRAPES WATERMELON", 10)
  };
  private static final TrendsQuery[] QUERIES3 = {new TrendsQuery("bla", 10)};
  private static final TrendsQuery[] QUERIES4 = {};

  private Cluster CLUSTER1;
  private Cluster CLUSTER2;
  private Cluster CLUSTER3;
  private Cluster CLUSTER4;
  private Cluster CLUSTER5;

  @Before
  public void init() {
    CLUSTER1 = new Cluster("c1", 1, QUERIES1);
    CLUSTER2 = new Cluster("c2", 2, QUERIES1);
    CLUSTER3 = new Cluster("c3", 3, QUERIES2);
    CLUSTER4 = new Cluster("c4", 4, QUERIES3);
    CLUSTER5 = new Cluster("c5", 5, QUERIES4);
  }

  /** Checks similarity of two clusters with the same queries. */
  @Test
  public void sameQueries() {
    List<Cluster> clusters = new ArrayList<>(Arrays.asList(CLUSTER1, CLUSTER2));
    Similarity.updateClustersSimilarity(clusters);
    Assert.assertEquals(CLUSTER1.relatedClustersIds, Arrays.asList(2));
    Assert.assertEquals(CLUSTER2.relatedClustersIds, Arrays.asList(1));
  }

  /**
   * Checks similarity of two clusters, the second one with an upper case verion of the queries of
   * the first.
   */
  @Test
  public void ignoreUpperCase() {
    List<Cluster> clusters = new ArrayList<>(Arrays.asList(CLUSTER1, CLUSTER3));
    Similarity.updateClustersSimilarity(clusters);
    Assert.assertEquals(CLUSTER1.relatedClustersIds, Arrays.asList(3));
    Assert.assertEquals(CLUSTER3.relatedClustersIds, Arrays.asList(1));
  }

  /** Checks similarity of two clusters with distinct queries words. */
  @Test
  public void nonRelatedQueries() {
    List<Cluster> clusters = new ArrayList<>(Arrays.asList(CLUSTER1, CLUSTER4));
    Similarity.updateClustersSimilarity(clusters);
    Assert.assertEquals(CLUSTER1.relatedClustersIds, Arrays.asList());
    Assert.assertEquals(CLUSTER4.relatedClustersIds, Arrays.asList());
  }

  /** Checks similarity of two clusters which one of them with empty queries list. */
  @Test
  public void nonQueries() {
    List<Cluster> clusters = new ArrayList<>(Arrays.asList(CLUSTER1, CLUSTER5));
    Similarity.updateClustersSimilarity(clusters);
    Assert.assertEquals(CLUSTER1.relatedClustersIds, Arrays.asList());
    Assert.assertEquals(CLUSTER5.relatedClustersIds, Arrays.asList());
  }
}
