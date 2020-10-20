// package com.google.sps;
/**
 * Represents a range of time with start and end dates (as strings in YYYY-MM format).
 */
public class DateRange {
  public static final String SEPERATOR = "-";
  String start;
  String end;

  public DateRange(String start, String end) {
    // check to match format
    String[] startDate = start.split(SEPERATOR);
    String[] endDate = end.split(SEPERATOR);
    start = startDate[1].length() == 1
        ? startDate[0] + SEPERATOR + "0" + startDate[1]
        : start;
    end = endDate[1].length() == 1
        ? endDate[0] + SEPERATOR + "0" + endDate[1]
        : end;
    this.start = start;
    this.end = end;
  }

  /**
   * @return The start date.
   */
  public String getStart() {
    return this.start;
  }

  /**
   * @return The end date.
   */
  public String getEnd() {
    return this.end;
  }
}
