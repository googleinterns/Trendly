import java.util.Map;

/** An object that contains a cluster and it's bag-of-word. */
public class ClusterBOW {

  Cluster cluster;
  Map<String, Double> bow;

  /**
   * @param cluster - The cluster object.
   * @param bow - The cluster's bag-of-word, a map between a word and it's frequency in the
   *     cluster's queries.
   */
  public ClusterBOW(Cluster cluster, Map<String, Double> bow) {
    this.cluster = cluster;
    this.bow = bow;
  }
}
