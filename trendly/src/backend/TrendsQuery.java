/** Google Trends API query data type */
public class TrendsQuery {
  public String title;
  public double value;

  public TrendsQuery() {}

  public TrendsQuery(String title, double value) {
    this.title = title;
    this.value = value;
  }
}
