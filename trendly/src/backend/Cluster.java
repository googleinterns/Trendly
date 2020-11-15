import java.util.ArrayList;
import java.util.List;

/**
 * Cluster data type, Contains the cluster's title, its id, array of queries and the IDs of clusters
 * similar to it.
 */
public class Cluster {
  String title;
  int id;
  double volume;
  TrendsQuery[] queriesToDisplay;
  TrendsQuery[] additionalQueries;
  List<Integer> relatedClustersIds;

  public Cluster(
      String title,
      int id,
      double volume,
      TrendsQuery[] queriesToDisplay,
      TrendsQuery[] additionalQueries) {
    this.title = title;
    this.id = id;
    this.volume = volume;
    this.queriesToDisplay = queriesToDisplay;
    this.additionalQueries = additionalQueries;
    this.relatedClustersIds = new ArrayList<>();
  }

  @Override
  public String toString() {
    return "title: "
        + this.title
        + "\nid: "
        + this.id
        + "\nvolume: "
        + this.volume
        + "\nqueriesToDisplay: "
        + this.queriesToDisplay
        + "\nadditionalQueries: "
        + this.additionalQueries
        + "\nrelatedClustersIds:"
        + this.relatedClustersIds;
  }
}
