/**
 * Represents histogram topic which contains trends topic properties + description.
 */
public class HistogramTopic extends TrendsTopic {
  public String description;
  @Override
  public String toString() {
    return this.title + this.mid + this.value + this.description;
  }
}
