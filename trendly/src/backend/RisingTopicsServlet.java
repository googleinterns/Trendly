import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.util.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Returns rising topic data. */
@WebServlet("/rising-topics")
public class RisingTopicsServlet extends HttpServlet {
  public static final String RESPONSE_JSON = "application/json";
  public static final String TERM_PARAMETER = "term";
  public static final String COUNTRY_PARAMETER = "country";
  public static final String START_DATE_PARAMETER = "startDate";
  public static final String END_DATE_PARAMETER = "endDate";
  public static final String INTERVAL_PARAMETER = "interval";
  public static final String CATEGORY_PARAMETER = "category";

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String country = request.getParameter(COUNTRY_PARAMETER);
    String term = request.getParameter(TERM_PARAMETER);
    String interval = request.getParameter(INTERVAL_PARAMETER);
    String startDate = request.getParameter(START_DATE_PARAMETER);
    String endDate = request.getParameter(END_DATE_PARAMETER);
    String category = request.getParameter(CATEGORY_PARAMETER);

    try {
      Map<HistogramTopic, TrendsGraphResult> results =
          HistogramyDataRetrieval.getDataForServlet(
              term, startDate, endDate, country, interval, category, TrendsFunctions.RISING_TOPICS);
      response.setContentType(RESPONSE_JSON);
      Gson gson = new GsonBuilder().enableComplexMapKeySerialization().create();
      String json = gson.toJson(results);
      System.out.println(json);
      response.getWriter().println(json);

    } catch (Exception c) {
      System.out.println(c.getMessage());
      throw new Error(c);
    }
  }
}
