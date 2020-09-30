// package com.google.sps;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;


public class HistogramyDataRetrieval {

    //gets restrictions call the API and return the data.
    public static LinkedHashMap<String, ArrayList<HistogramTopic>> getDataForServlet(String term, String startDate, String endDate, String country, String interval, String funcName) throws NumberFormatException, IOException {
        ArrayList<DateRange> dates = dateProcessing(startDate, endDate, Integer.parseInt(interval));
        LinkedHashMap<String, ArrayList<HistogramTopic>> results = new LinkedHashMap<>();
        for (DateRange date : dates) {
            results.put(date.getStart() + " : " + date.getEnd(), retriveDataFromApi(date, country, term, funcName));

        }
        return results;
    }

    //return a list of range dates.
    private static ArrayList<DateRange> dateProcessing(String startDate, String endDate, int interval) {
        int currentYear = Integer.parseInt(startDate.split("-")[0]);
        int currentMonth = Integer.parseInt(startDate.split("-")[1]);

        int endYear = Integer.parseInt(endDate.split("-")[0]);
        int endMonth = Integer.parseInt(endDate.split("-")[1]);

        ArrayList<DateRange> ranges = new ArrayList<>();

        while (currentYear < endYear || (currentYear == endYear && currentMonth <= endMonth)) {
            int endOfIntervalMonth = currentMonth + interval - 1;
            int endOfIntervalYear = currentYear;
            //while in case the interval is more than 1 year
            while (endOfIntervalMonth > 12) {
                endOfIntervalMonth = endOfIntervalMonth - 12;
                endOfIntervalYear++;
            }

            //check out of range
            if (endOfIntervalYear > endYear || (endOfIntervalYear == endYear && endOfIntervalMonth > endMonth)) {
                endOfIntervalMonth = endMonth;
                endOfIntervalYear = endYear;
            }

            DateRange newDR = new DateRange(currentYear + "-" + currentMonth, endOfIntervalYear + "-" + endOfIntervalMonth);
            ranges.add(newDR);
            currentYear = endOfIntervalYear;
            currentMonth = endOfIntervalMonth + 1;
            if (currentMonth > 12) {
                currentMonth = currentMonth % 12;
                currentYear++;
            }
        }

        return ranges;
    }

    //calls API and run over the topics results to handle each one and call KG graph.
    private static ArrayList<HistogramTopic> retriveDataFromApi(DateRange date, String country, String term, String funcName) throws IOException {
        ArrayList<HistogramTopic> allTopics = new ArrayList<HistogramTopic>();
        if (funcName.equals(TrendsFunctions.TOP_TOPICS)) {
            TrendsTopicsResult allAPITopics = (TrendsTopicsResult) TrendsAPIWrapper.fetchDataFromTrends(funcName, term, country, date.getStart(), date.getEnd());
            if (allAPITopics.item != null) {
                for (TrendsTopic topic : allAPITopics.item) {
                allTopics.add(HandleTopic(topic));
            }

        }
        }
        else {
            TrendsRisingTopicsResult allAPITopics = (TrendsRisingTopicsResult) TrendsAPIWrapper.fetchDataFromTrends(funcName, term, country, date.getStart(), date.getEnd());
            if (allAPITopics.item != null) {
                for (TrendsRisingTopic topic : allAPITopics.item) {
                    allTopics.add(HandleTopic(topic));
                }
            }
        }
        return allTopics;
    }

    private static HistogramTopic HandleTopic(TrendsTopic topic) {
        HistogramTopic newTopic =  new HistogramTopic();
        //calls KG graph in order to extract the description
        newTopic.description = "lala";
        newTopic.title = topic.title;
        newTopic.value = topic.value;
        newTopic.mid = topic.mid;
        return newTopic;
    }
}
