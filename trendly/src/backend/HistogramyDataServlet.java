
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.util.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.sps.HistogramTopic;
import com.google.sps.*;

/** Returns rising topic data. */
@WebServlet("/histogramy-data")
public class HistogramyDataServlet extends HttpServlet {
  public static final String RESPONSE_JSON = "application/json";
  public static final String TERM_PARAMETER = "term";
  public static final String COUNTRY_PARAMETER = "country";
  public static final String START_DATE_PARAMETER = "startDate";
  public static final String END_DATE_PARAMETER = "endDate";
  public static final String INTERVAL_PARAMETER = "interval";
  public static final String CATEGORY_PARAMETER = "category";
  public static final String FUNCTION_PARAMETER = "funcName";
  public static final String TOPICS_PARAMETER = "topics";

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String country = request.getParameter(COUNTRY_PARAMETER);
    String term = request.getParameter(TERM_PARAMETER);
    String interval = request.getParameter(INTERVAL_PARAMETER);
    String startDate = request.getParameter(START_DATE_PARAMETER);
    String endDate = request.getParameter(END_DATE_PARAMETER);
    String category = request.getParameter(CATEGORY_PARAMETER);
    String funcName = request.getParameter(FUNCTION_PARAMETER);
    String topicsString = request.getParameter(TOPICS_PARAMETER);
    HistogramTopic[] topics;
    Gson gson1 = new Gson();

    topics = gson1.fromJson(topicsString, HistogramTopic[].class);

    try {
      response.setContentType(RESPONSE_JSON);
      Gson gson = new GsonBuilder().enableComplexMapKeySerialization().create();
      String json;

      // Initial request, fetch topics list.
      if (topics == null || topics.length == 0) {
        List<HistogramTopic> topicsResult =
            HistogramyDataRetrieval.getInitialTopicsList(
                term, startDate, endDate, country, interval, category, funcName);
        json = gson.toJson(topicsResult);
      } else { // Get the relevant information for all the given topics.
        Map<HistogramTopic, TrendsGraphResult> TopicToGraphResult =
            HistogramyDataRetrieval.getDataForTopics(
                term,
                startDate,
                endDate,
                country,
                interval,
                category,
                funcName,
                Arrays.asList(topics));
        json = gson.toJson(TopicToGraphResult);
      }
      response.getWriter().println(json);

    } catch (Exception c) {
      System.out.println(c.getMessage());
      throw new Error(c);
    }
  }
}
