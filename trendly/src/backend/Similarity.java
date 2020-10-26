import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * A class that checks similarity between clusters. Given a list of clusters, updates the clusters'
 * related clusters' IDs. The similarity algorithm is based on bag-of-words as features combined
 * with TFIDF for normalization. After finding the comparing features we use Cosine similarity for
 * the final similarity score.
 */
public class Similarity {
  private static final double SIMILARITY_THRESHOLD = 0.5;

  /** Given a list of clusters updates the clusters' similarities. */
  public static void updateClustersSimilarity(List<Cluster> clusters) {
    Map<String, Double> wordIdf = new HashMap<>();
    List<ClusterBOW> clusterWordFreq = calculateFrequencies(clusters, wordIdf);
    // The next 2 lines handles adding the tf-idf normalization.
    wordIdf = convertToIdf(wordIdf, clusters.size());
    updateBowToTFIDF(clusterWordFreq, wordIdf);
    updateRelatedClusters(clusterWordFreq, calculateClustersNorm(clusterWordFreq));
  }

  /**
   * Calculates words frequencies for each cluster and return a list of ClusterBOW objects (which
   * contains the frequency map).
   *
   * @param clusters All given clusters.
   * @param allWords A map to fill with all found words to their index in the BOW vector.
   * @return
   */
  static List<ClusterBOW> calculateFrequencies(
      List<Cluster> clusters, Map<String, Double> wordIdf) {
    List<ClusterBOW> clusterWordFreq = new ArrayList<>();
    clusters.stream()
        .forEach(
            (Cluster cluster) -> {
              List<String> clusterWords =
                  Stream.concat(
                          Arrays.stream(cluster.queriesToDisplay),
                          Arrays.stream(cluster.additionalQueries))
                      .map((query) -> Arrays.asList(query.title.toLowerCase().split(" ")))
                      .flatMap(List::stream)
                      .collect(Collectors.toList());
              Map<String, Double> frequencies =
                  clusterWords.stream()
                      .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
                      .entrySet()
                      .stream()
                      .collect(
                          Collectors.toMap(
                              Map.Entry::getKey, (entry) -> (double) entry.getValue()));
              updateWordDocAppearance(wordIdf, frequencies.keySet());
              clusterWordFreq.add(new ClusterBOW(cluster, frequencies));
            });
    return clusterWordFreq;
  }

  /** Updates wordIdf to map word to its frequency based on given the set of words. */
  private static void updateWordDocAppearance(Map<String, Double> wordIdf, Set<String> words) {
    words.forEach(
        (word) -> {
          wordIdf.merge(word, 1.0, (prevValue, increment) -> prevValue + increment);
        });
  }

  /**
   * Converts the value of each word in wordIdf from raw count frequency to smooth inverse document
   * frequency.
   */
  private static Map<String, Double> convertToIdf(Map<String, Double> wordIdf, int docAmount) {
    return wordIdf.entrySet().stream()
        .collect(
            Collectors.toMap(
                Map.Entry::getKey, (entry) -> 1 + Math.log(docAmount / (entry.getValue()) + 1)));
  }

  /**
   * Updates the bag-of-word in each ClusterBOW object to contain a map between a word to its tfidf
   * (term frequency * inverse document frequency).
   */
  private static void updateBowToTFIDF(
      List<ClusterBOW> clusterWordFreq, Map<String, Double> wordIdf) {
    clusterWordFreq.forEach(
        (clusterBow) -> {
          clusterBow.bow =
              clusterBow.bow.entrySet().stream()
                  .collect(
                      Collectors.toMap(
                          Map.Entry::getKey,
                          (entry) -> entry.getValue() * wordIdf.get(entry.getKey())));
        });
  }

  /**
   * Updates the relatedClustersIds attributes of the clusters in clustersBow based on the
   * cosineSimilarity of their bag-of-word.
   */
  private static void updateRelatedClusters(
      List<ClusterBOW> clusterWordFreq, Map<Integer, Double> clusterIDToNorms) {
    System.out.println(clusterWordFreq);
    for (int i = 0; i < clusterWordFreq.size(); i++) {
      for (int j = 0; j < i; j++) {
        double norm1 = clusterIDToNorms.get(clusterWordFreq.get(i).cluster.id);
        double norm2 = clusterIDToNorms.get(clusterWordFreq.get(j).cluster.id);
        calcCosineAndUpdate(clusterWordFreq, i, j, norm1, norm2);
      }
    }
  }

  /** Calculates cosine similarity and updates the related clusters if needed. */
  private static void calcCosineAndUpdate(
      List<ClusterBOW> clusterWordFreq, int i, int j, double norm1, double norm2) {
    double cosineSimilarity =
        (norm1 == 0 || norm2 == 0)
            ? 0
            : dotProduct(clusterWordFreq.get(i).bow, clusterWordFreq.get(j).bow) / (norm1 * norm2);
    if (cosineSimilarity > SIMILARITY_THRESHOLD) {
      addToRelatedClusters(clusterWordFreq, i, j);
      addToRelatedClusters(clusterWordFreq, j, i);
    }
  }

  /**
   * Calculates the bag-of-words' norm of each cluster, and returns a map between cluster Id to its
   * norm.
   */
  private static Map<Integer, Double> calculateClustersNorm(List<ClusterBOW> clusterWordFreq) {
    Map<Integer, Double> clusterIDToNorms = new HashMap<>();
    clusterWordFreq.forEach(
        (clusterBow) -> clusterIDToNorms.put(clusterBow.cluster.id, norm(clusterBow.bow)));
    return clusterIDToNorms;
  }

  /**
   * Adds the cluster in clustersBow[j] to the relatedClustersIds attribute of the clusters in
   * clustersBow[i].
   */
  private static void addToRelatedClusters(List<ClusterBOW> clustersBow, int i, int j) {
    clustersBow.get(i).cluster.relatedClustersIds.add(clustersBow.get(j).cluster.id);
  }

  /**
   * Returns the dot product of bow1 and bow2 (the sum of frequencies' production of words appearing
   * in both bag-of-words).
   */
  private static double dotProduct(Map<String, Double> bow1, Map<String, Double> bow2) {
    double dot = 0.0;
    for (String word : bow1.keySet()) {
      if (bow2.containsKey(word)) {
        dot += bow1.get(word) * bow2.get(word);
      }
    }
    return dot;
  }

  /** Returns the norm of the given bag-of-words. */
  private static double norm(Map<String, Double> bow) {
    return Math.sqrt(dotProduct(bow, bow));
  }
}
