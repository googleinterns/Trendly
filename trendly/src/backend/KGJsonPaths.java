/** Json paths for the returned elments from Knowledge Graph API. */
public class KGJsonPaths {
  public static final String DESCRIPTION = "$.result[?(@.description)].description";
  public static final String DETAILED_DESCRIPTION =
      "$.result[?(@.detailedDescription)].detailedDescription[?(@.articleBody)].articleBody";
  public static final String URL = "$.result[?(@.detailedDescription)][?(@.url)]";
  public static final String ELEMENTS = "itemListElement";
}
