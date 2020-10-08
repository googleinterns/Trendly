package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.sps.Cluster;
import com.google.sps.QueriesExpansion;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns list of Cluster objects (in json format) for clusterly front-end */
@WebServlet("/clusterly-data")
public class ClusterlyDataServlet extends HttpServlet {
  public static final String JSON_CONTENT = "application/json;";
  public static final String TERM_PARAMETER = "term";
  public static final String COUNTRY_PARAMETER = "country";
  public static final String START_DATE_PARAMETER = "startDate";
  public static final String END_DATE_PARAMETER = "endDate";

  /** Returns json of List<Cluster> based on the given url parameters */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String[] terms = request.getParameterValues(TERM_PARAMETER);
    String country = request.getParameter(COUNTRY_PARAMETER);
    String startDate = request.getParameter(START_DATE_PARAMETER);
    String endDate = request.getParameter(END_DATE_PARAMETER);
    try {
      List<Cluster> clusters = QueriesExpansion.getAllClusters(terms, country, startDate, endDate);
      Gson gson = new Gson();
      String clustersJson = gson.toJson(clusters);
      response.setContentType(JSON_CONTENT);
      response.getWriter().println(clustersJson);
    } catch (InterruptedException | ExecutionException e) {
      throw new Error(e);
    }
  }
}
