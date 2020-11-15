import java.io.IOException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class TrendsAPIWrapperTest {
  // Restrictions
  private static final String TERM = "google";
  private static final String LOCATION = "US";
  private static final String START_DATE = "2018-10";
  private static final String END_DATE = "2019-10";
  private static final String CATEGORY = "0";

  /** Checks fetchDataFromTrends with topTopic API function returns TrendsTopicsResult object */
  @Test
  public void topTopicsReturnType() throws IOException {
    final TrendsResult res =
        TrendsAPIWrapper.fetchDataFromTrends(
            TrendsFunctions.TOP_TOPICS, TERM, LOCATION, START_DATE, END_DATE, CATEGORY);
    Assert.assertTrue(res instanceof TrendsTopicsResult);
  }

  /**
   * Checks fetchDataFromTrends with risingTopics API function returns TrendsRisingTopicsResult
   * object
   */
  @Test
  public void risingTopicsReturnType() throws IOException {
    final TrendsResult res =
        TrendsAPIWrapper.fetchDataFromTrends(
            TrendsFunctions.RISING_TOPICS, TERM, LOCATION, START_DATE, END_DATE, CATEGORY);
    Assert.assertTrue(res instanceof TrendsRisingTopicsResult);
  }

  /** Checks fetchDataFromTrends with topQueries API function returns TrendsQueriesResult object */
  @Test
  public void topQueriesReturnType() throws IOException {
    final TrendsResult res =
        TrendsAPIWrapper.fetchDataFromTrends(
            TrendsFunctions.TOP_QUERIES, TERM, LOCATION, START_DATE, END_DATE, CATEGORY);
    Assert.assertTrue(res instanceof TrendsQueriesResult);
  }

  /**
   * Checks fetchDataFromTrends with risingQueries API function returns TrendsRisingQueriesResult
   * object.
   */
  @Test
  public void risingQueriesReturnType() throws IOException {
    final TrendsResult res =
        TrendsAPIWrapper.fetchDataFromTrends(
            TrendsFunctions.RISING_QUERIES, TERM, LOCATION, START_DATE, END_DATE, CATEGORY);
    Assert.assertTrue(res instanceof TrendsRisingQueriesResult);
  }

  /** Checks fetchDataFromTrends with getGraph API function returns TrendsGraphResult object. */
  @Test
  public void getGraphReturnType() throws IOException {
    final TrendsResult res =
        TrendsAPIWrapper.fetchDataFromTrends(
            TrendsFunctions.GET_GRAPH, TERM, LOCATION, START_DATE, END_DATE, CATEGORY);
    Assert.assertTrue(res instanceof TrendsGraphResult);
  }
}
