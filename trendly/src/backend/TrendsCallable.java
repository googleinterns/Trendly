import java.io.IOException;
import java.util.concurrent.Callable;

/**
 * For using TrendsAPIWrapper with threads (each TrendsCallable instance represents an asynchronous
 * task which can be executed by a separate thread)
 */
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

  /** Calls TrendsAPIWrapper with the restriction given in the constructor */
  @Override
  public TrendsResult call() throws IOException {
    return TrendsAPIWrapper.fetchDataFromTrends(
        this.trendsFunction, this.term, this.location, this.startDate, this.endDate);
  }
}
