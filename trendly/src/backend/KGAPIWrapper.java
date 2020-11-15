import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.jayway.jsonpath.JsonPath;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

/** A wrapper class to access Google Knowledge Graph API. */
public class KGAPIWrapper {
  private static final String BASE_URL = "https://kgsearch.googleapis.com/v1/entities:search";
  private static final String API_KEY = "";

  /**
   * Returns the description in KG of the KG entity with the given mid.
   *
   * @param mid -A string id of KG entity.
   */
  public static String getDescription(String mid) {
    String description = "";
    try {
      HttpTransport httpTransport = new NetHttpTransport();
      HttpRequestFactory requestFactory = httpTransport.createRequestFactory();
      JSONParser parser = new JSONParser();
      GenericUrl url = buildUrl(mid);
      HttpRequest request = requestFactory.buildGetRequest(url);
      HttpResponse httpResponse = request.execute();
      JSONObject response = (JSONObject) parser.parse(httpResponse.parseAsString());
      description = extractDescription(response);
    } catch (Exception ex) {
      ex.printStackTrace();
    }
    return description;
  }

  /** Returns the url for querying KG API with the given mid. */
  private static GenericUrl buildUrl(String mid) {
    GenericUrl url = new GenericUrl(BASE_URL);
    url.put("ids", mid);
    url.put("key", API_KEY);
    return url;
  }

  /**
   * Returns the entity description from the given respone. If regular description exists returns
   * it. Otherwise if detailed description exists returend its first sentence. Otherwise if relevant
   * url exists returns it. Otherwise returns empty string.
   */
  private static String extractDescription(JSONObject response) {
    JSONArray elements = (JSONArray) response.get(KGJsonPaths.ELEMENTS);
    if (elements.isEmpty()) return "";
    Object element = elements.get(0);
    String description = JsonPath.read(element, KGJsonPaths.DESCRIPTION).toString();
    if (description.equals("[]")) {
      String detailedDescription =
          JsonPath.read(element, KGJsonPaths.DETAILED_DESCRIPTION).toString();
      description =
          detailedDescription.contains(".")
              ? detailedDescription.split("\\.")[0]
              : JsonPath.read(element, KGJsonPaths.URL).toString();
    }
    return description.replace("[\"", "").replace("\"]", "");
  }
}
