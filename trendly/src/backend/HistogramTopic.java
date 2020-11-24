/** Represents histogram topic which contains trends topic properties + description. */
public class HistogramTopic extends TrendsTopic {
  public String description;

  public double getValue() {
    return this.value;
  }

  @Override
  public String toString() {
    return this.title + " " + this.mid + " " + this.value + " " + this.description;
  }

  @Override
  public boolean equals(Object obj) {
    if (obj == this) {
      return true;
    }

    if (!(obj instanceof HistogramTopic)) {
      return false;
    }

    HistogramTopic otherTopic = (HistogramTopic) obj;
    return this.title.equals(otherTopic.title);
  }

  @Override
  public int hashCode() {
    return this.title.hashCode();
  }
}
