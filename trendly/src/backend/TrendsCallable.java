import java.io.IOException;
import java.util.concurrent.Callable;

public class TrendsCallable implements Callable<TrendsResult> {
  String trendsFunction;
  String term;
  String location;
  String startDate;
  String endDate;

  public TrendsCallable(
      String trendsFunction, String term, String location, String startDate, String endDate) {
    this.trendsFunction = trendsFunction;
    this.term = term;
    this.location = location;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  @Override
  public TrendsResult call() throws IOException {
    return TrendsAPIWrapper.fetchDataFromTrends(
        this.trendsFunction, this.term, this.location, this.startDate, this.endDate);
  }
}
