import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Collectors;

public class Similarity {
  private static final double SIMILARITY_THRESHOLD = 0.5;

  /** Given an Clusters array updates the clusters' similarities. */
  public static void updateClustersSimilarity(List<Cluster> clusters) {
    HashMap<String, Integer> allWords = new HashMap<>();
    updateRelatedClusters(createClustersBOW(allWords, findAllWords(clusters, allWords)));
  }

  /**
   * Finds all words appear in the clusters queries, and counts words appearance for each cluster.
   *
   * @param clusters All given clusters.
   * @param allWords A map to fill with all found words to their index in the BOW vector.
   * @return
   */
  static HashMap<Cluster, Map<String, Long>> findAllWords(
      List<Cluster> clusters, HashMap<String, Integer> allWords) {
    HashMap<Cluster, Map<String, Long>> countWordsPerCluster = new HashMap<>();
    AtomicInteger index = new AtomicInteger(0);
    clusters.stream()
        .map(
            (Cluster cluster) -> {
              List<String> clusterWords =
                  Arrays.stream(cluster.queries)
                      .map((query) -> Arrays.asList(query.title.toLowerCase().split(" ")))
                      .flatMap(List::stream)
                      .collect(Collectors.toList());
              Map<String, Long> frequencies =
                  clusterWords.stream()
                      .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
              countWordsPerCluster.put(cluster, frequencies);
              return clusterWords;
            })
        .flatMap(List::stream)
        .distinct()
        .forEach(
            (word) -> {
              allWords.put(word, index.getAndIncrement());
            });
    return countWordsPerCluster;
  }

  /**
   * Creates BOW vector for each cluster.
   *
   * @param allWords
   * @param clustersAndCounts
   * @return Array of ClusterBOW objects.
   */
  static ClusterBOW[] createClustersBOW(
      HashMap<String, Integer> allWords, HashMap<Cluster, Map<String, Long>> clustersAndCounts) {
    AtomicInteger index = new AtomicInteger(0);
    ClusterBOW[] clustersBOW = new ClusterBOW[clustersAndCounts.size()];
    clustersAndCounts.forEach(
        (cluster, frequencyMap) -> {
          int i = index.getAndIncrement();
          clustersBOW[i] = new ClusterBOW(cluster, allWords.size());
          frequencyMap.forEach(
              (word, frequency) -> {
                clustersBOW[i].bow[allWords.get(word)] = (int) (long) frequency;
              });
        });
    return clustersBOW;
  }

  /**
   * Updates the relatedClustersIds attributes of the clusters in clustersBow based on the
   * cosineSimilarity of their bag-of-word.
   */
  private static void updateRelatedClusters(ClusterBOW[] clustersBow) {
    for (int i = 0; i < clustersBow.length; i++) {
      for (int j = 0; j < i; j++) {
        if (cosineSimilarity(clustersBow[i].bow, clustersBow[j].bow) > SIMILARITY_THRESHOLD) {
          addToRelatedClusters(clustersBow, i, j);
          addToRelatedClusters(clustersBow, j, i);
        }
      }
    }
  }

  /**
   * Adds the cluster in clustersBow[j] to the relatedClustersIds attribute of the clusters in
   * clustersBow[i].
   */
  private static void addToRelatedClusters(ClusterBOW[] clustersBow, int i, int j) {
    clustersBow[i].cluster.relatedClustersIds.add(clustersBow[j].cluster.id);
  }

  /** Returns the cosine similarity of vector1 and vector2. */
  private static double cosineSimilarity(int[] vector1, int[] vector2) {
    double norm1 = norm(vector1);
    double norm2 = norm(vector2);
    if (norm1 == 0 || norm2 == 0) {
      return 0.0;
    }
    return dotProduct(vector1, vector2) / (norm1 * norm2);
  }

  /** Returns the dot product of vector1 and vector2. */
  private static double dotProduct(int[] vector1, int[] vector2) {
    double dot = 0.0;
    for (int i = 0; i < vector1.length; i++) {
      dot += vector1[i] * vector2[i];
    }
    return dot;
  }

  /** Returns the norm of the given vector. */
  private static double norm(int[] vector) {
    return Math.sqrt(dotProduct(vector, vector));
  }
}
