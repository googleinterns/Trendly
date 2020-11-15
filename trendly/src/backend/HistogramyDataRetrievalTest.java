import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class HistogramyDataRetrievalTest {

  private static final Map<HistogramTopic, TrendsGraphResult> EMPTY_MAP_RESULT = new HashMap<>();
  private static final String NON_EXIST_TERM = "lsairfjuolerukhsdkiweioueoiewwwdewed";
  private static final String LOCATION = "US";
  private static final String START_DATE = "2016-08";
  private static final String END_DATE = "2020-08";
  private static final String CATEGORY = "0";

  /**
   * Test date process - on one year range, interval .
   *
   * @throws IOException
   */
  @Test
  public void dateProcessCheck1() throws IOException {

    ArrayList<DateRange> expected =
        new ArrayList<DateRange>(
            Arrays.asList(
                new DateRange("2010-10", "2010-10"),
                new DateRange("2010-11", "2010-11"),
                new DateRange("2010-12", "2010-12")));
    ArrayList<DateRange> actual = HistogramyDataRetrieval.dateProcessing("2010-10", "2010-12", 1);
    Assert.assertEquals(expected.size(), actual.size());
    for (int i = 0; i < expected.size(); i++) {
      Assert.assertEquals(expected.get(i).start, actual.get(i).start);
      Assert.assertEquals(expected.get(i).end, actual.get(i).end);
    }
  }

  /**
   * Test date process - on 2 years range, 1 interval .
   *
   * @throws IOException
   */
  @Test
  public void dateProcessCheck2() throws IOException {
    ArrayList<DateRange> expected =
        new ArrayList<DateRange>(
            Arrays.asList(
                new DateRange("2010-11", "2010-11"),
                new DateRange("2010-12", "2010-12"),
                new DateRange("2011-01", "2011-01"),
                new DateRange("2011-02", "2011-02"),
                new DateRange("2011-03", "2011-03")));
    ArrayList<DateRange> actual = HistogramyDataRetrieval.dateProcessing("2010-11", "2011-03", 1);
    Assert.assertEquals(expected.size(), actual.size());
    for (int i = 0; i < expected.size(); i++) {
      Assert.assertEquals(expected.get(i).start, actual.get(i).start);
      Assert.assertEquals(expected.get(i).end, actual.get(i).end);
    }
  }

  /**
   * Test date process - on 2 years range, 2 interval .
   *
   * @throws IOException
   */
  @Test
  public void dateProcessCheck3() throws IOException {
    ArrayList<DateRange> expected =
        new ArrayList<DateRange>(
            Arrays.asList(
                new DateRange("2010-11", "2010-12"),
                new DateRange("2011-01", "2011-02"),
                new DateRange("2011-03", "2011-04"),
                new DateRange("2011-05", "2011-05")));
    ArrayList<DateRange> actual = HistogramyDataRetrieval.dateProcessing("2010-11", "2011-05", 2);
    Assert.assertEquals(expected.size(), actual.size());
    for (int i = 0; i < expected.size(); i++) {
      Assert.assertEquals(expected.get(i).start, actual.get(i).start);
      Assert.assertEquals(expected.get(i).end, actual.get(i).end);
    }
  }

  /**
   * Test date process - on 3 years range, interval more than 12 monthes.
   *
   * @throws IOException
   */
  @Test
  public void dateProcessCheck4() throws IOException {
    ArrayList<DateRange> expected =
        new ArrayList<DateRange>(
            Arrays.asList(
                new DateRange("2010-11", "2011-11"),
                new DateRange("2011-12", "2012-12"),
                new DateRange("2013-01", "2014-01"),
                new DateRange("2014-02", "2014-05")));
    ArrayList<DateRange> actual = HistogramyDataRetrieval.dateProcessing("2010-11", "2014-05", 13);
    Assert.assertEquals(expected.size(), actual.size());
    for (int i = 0; i < expected.size(); i++) {
      Assert.assertEquals(expected.get(i).start, actual.get(i).start);
      Assert.assertEquals(expected.get(i).end, actual.get(i).end);
    }
  }

  /**
   * Test return object of Topic handler.
   *
   * @throws IOException
   */
  @Test
  public void checkTopicHandler() throws IOException {
    HistogramTopic expected = new HistogramTopic();
    expected.title = "test";
    expected.value = 100;
    expected.mid = "/love-test";
    expected.description = "";
    TrendsTopic topic = new TrendsTopic();
    topic.title = "test";
    topic.value = 100;
    topic.mid = "/love-test";
    HistogramTopic actual = HistogramyDataRetrieval.handleTopic(topic);
    Assert.assertEquals(expected.title, actual.title);
    Assert.assertEquals(expected.mid, actual.mid);
    Assert.assertTrue(expected.value == actual.value);
    Assert.assertEquals(expected.description, actual.description);
  }

  /**
   * Checks getDataForServlet with TopTopics and search term that doesn't exist returns empty map.
   *
   * @throws Exception
   */
  @Test
  public void emptyResultTopTopics() throws Exception {
    Map<HistogramTopic, TrendsGraphResult> res =
        HistogramyDataRetrieval.getDataForServlet(
            NON_EXIST_TERM,
            START_DATE,
            END_DATE,
            LOCATION,
            "1",
            CATEGORY,
            TrendsFunctions.TOP_TOPICS);
    Assert.assertEquals(EMPTY_MAP_RESULT, res);
  }

  /**
   * Checks getDataForServlet with RisingTopics andsearch term that doesn't exist returns empty map.
   *
   * @throws Exception
   */
  @Test
  public void emptyResultRisingTopics() throws Exception {
    Map<HistogramTopic, TrendsGraphResult> res =
        HistogramyDataRetrieval.getDataForServlet(
            NON_EXIST_TERM,
            START_DATE,
            END_DATE,
            LOCATION,
            "1",
            CATEGORY,
            TrendsFunctions.RISING_TOPICS);
    Assert.assertEquals(EMPTY_MAP_RESULT, res);
  }
}
