public class ClusterBOW {
  Cluster cluster;
  int[] bow;

  public ClusterBOW(Cluster cluster, int n) {
    this.cluster = cluster;
    this.bow = new int[n];
  }
}
