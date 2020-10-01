// package com.google.sps;
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

  public String getStart() {
    return this.start;
  }

  public String getEnd() {
    return this.end;
  }
}
