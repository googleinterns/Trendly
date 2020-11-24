import java.io.IOException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class KGAPIWrapperTest {
  private static final String INVALID_MID = "";
  private static final String NAIL_MID = "/m/023j4r";
  private static final String RESULT_MID = "/m/0687b1";
  private static final String EMPTY_DESCRIPTION = "";

  /** Checks getDescription with invalid mid returns empty description. */
  @Test
  public void invalidMid() throws IOException {
    String description = KGAPIWrapper.getDescription(INVALID_MID);
    Assert.assertEquals(EMPTY_DESCRIPTION, description);
  }

  /**
   * Checks getDescription with mid of KG entity that doesn't include description nor detailed
   * description returns empty description.
   */
  @Test
  public void noDescriptionOrDetailed() throws IOException {
    String description = KGAPIWrapper.getDescription(NAIL_MID);
    Assert.assertEquals(EMPTY_DESCRIPTION, description);
  }

  /**
   * Checks getDescription with mid of KG entity that doesn't include description but includes
   * detailed description returns non-empty description.
   */
  @Test
  public void noDescriptionJustDetailed() throws IOException {
    String description = KGAPIWrapper.getDescription(RESULT_MID);
    Assert.assertNotEquals(EMPTY_DESCRIPTION, description);
  }
}
