
import com.google.gson.Gson;
import java.io.IOException;
import java.util.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Returns Top topics data.
 * */
@WebServlet("/top-topics")
public class TopTopicsServlet extends HttpServlet {
  public static final String RESPONSE_JSON = "application/json";
  public static final String TERM_PARAMETER = "term";
  public static final String COUNTRY_PARAMETER = "country";
  public static final String START_DATE_PARAMETER = "startDate";
  public static final String END_DATE_PARAMETER = "endDate";
  public static final String INTERVAL_PARAMETER = "interval";

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String country = request.getParameter(COUNTRY_PARAMETER);
    String term = request.getParameter(TERM_PARAMETER);
    String interval = request.getParameter(INTERVAL_PARAMETER);
    String startDate = request.getParameter(START_DATE_PARAMETER);
    String endDate = request.getParameter(END_DATE_PARAMETER);

    System.out.println(startDate + " " + endDate);

    LinkedHashMap<String, ArrayList<HistogramTopic>> results =
        HistogramyDataRetrieval.getDataForServlet(
            term, startDate, endDate, country, interval, TrendsFunctions.TOP_TOPICS);

    response.setContentType(RESPONSE_JSON);
    String json = new Gson().toJson(results);
    response.getWriter().println(json);
  }
}
