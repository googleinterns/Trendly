/** Google Trends API top topic result data type */
public class TrendsTopicsResult implements TrendsHistogramResult {
  public TrendsTopic[] item;

  public TrendsTopic[] getItem() {
    return this.item;
  }
}
