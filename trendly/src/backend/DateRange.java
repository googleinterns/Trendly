// package com.google.sps;
/**
 * Represents date range with satrt and end date (as strings in format YYYY-MM).
 */
public class DateRange {
  public static final String SEPERATOR = "-";
  String start;
  String end;

  public DateRange(String start, String end) {
    // check to match format
    start = start.split(SEPERATOR)[1].length() == 1
        ? start.split(SEPERATOR)[0] + SEPERATOR + "0" + start.split("-")[1]
        : start;
    end = end.split(SEPERATOR)[1].length() == 1
        ? end.split(SEPERATOR)[0] + SEPERATOR + "0" + end.split(SEPERATOR)[1]
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
