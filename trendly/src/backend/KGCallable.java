import java.io.IOException;
import java.util.concurrent.Callable;

/**
 * For using KGAPIWrapper with threads (each KGCallable instance represents an asynchronous task
 * which can be executed by a separate thread).
 */
public class KGCallable implements Callable<String> {
  String mid;

  public KGCallable(String mid) {
    this.mid = mid;
  }

  /** Calls KGAPIWrapper with the mid given in the constructor. */
  @Override
  public String call() throws IOException {
    return KGAPIWrapper.getDescription(this.mid);
  }
}
