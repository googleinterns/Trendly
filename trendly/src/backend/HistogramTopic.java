public class HistogramTopic extends TrendsTopic {
  public String description;
  @Override
  public String toString() {
    return this.title + this.mid + this.value + this.description;
  }
}
