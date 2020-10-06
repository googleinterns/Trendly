/** An object that contains a cluster and it's bag-of-word */
public class ClusterBOW {

  Cluster cluster;
  int[] bow;

  /**
   * @param cluster
   * @param n - size of bag-of-word array
   */
  public ClusterBOW(Cluster cluster, int n) {
    this.cluster = cluster;
    this.bow = new int[n];
  }
}
