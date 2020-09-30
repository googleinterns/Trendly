// package com.google.sps;
public class DateRange {
    String start;
    String end;

    public DateRange(String start, String end) {
        //check to match format
        start = start.split("-")[1].length() == 1 ? start.split("-")[0] + "-" + "0" + start.split("-")[1] : start;
        end = end.split("-")[1].length() == 1 ? end.split("-")[0] + "-" + "0" + end.split("-")[1] : end;
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
