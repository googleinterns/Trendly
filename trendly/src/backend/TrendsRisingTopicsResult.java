/** Google Trends API rising topics result data type */
public class TrendsRisingTopicsResult implements TrendsHistogramResult {
  public TrendsRisingTopic[] item;

  public TrendsTopic[] getItem() {
    return this.item;
  }
}
