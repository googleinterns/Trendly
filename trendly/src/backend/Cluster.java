/** Cluster data type, Contains the cluster's title, its id and an Array of queries. */
public class Cluster {
  String title;
  int id;
  TrendsQuery[] queries;

  public Cluster(String title, int id, TrendsQuery[] queries) {
    this.title = title;
    this.id = id;
    this.queries = queries;
  }
}
