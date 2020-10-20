package com.google.sps;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

import com.google.gson.Gson;
import com.google.sps.servlets.ClusterlyDataServlet;
import java.io.*;
import javax.servlet.http.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/** Tests for ClusterlyDataServlet */
@RunWith(JUnit4.class)
public final class ClusterlyDataServletTest extends HttpServlet {
  private static final String TERM_PARAMETER = "term";
  private static final String COUNTRY_PARAMETER = "country";
  private static final String START_DATE_PARAMETER = "startDate";
  private static final String END_DATE_PARAMETER = "endDate";
  public static final String CATEGORY_PARAMETER = "category";
  private static final String[] TERMS = {""};
  private static final String COUNTRY = "US";
  private static final String START_DATE = "2019-10";
  private static final String END_DATE = "2020-10";
  private static final String CATEGORY = "0";

  /** Tests ClusterlyDataServlet returns list of clusters */
  @Test
  public void testServletReturnType() throws Exception {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);

    when(request.getParameterValues(TERM_PARAMETER)).thenReturn(TERMS);
    when(request.getParameter(COUNTRY_PARAMETER)).thenReturn(COUNTRY);
    when(request.getParameter(START_DATE_PARAMETER)).thenReturn(START_DATE);
    when(request.getParameter(END_DATE_PARAMETER)).thenReturn(END_DATE);
    when(request.getParameter(CATEGORY_PARAMETER)).thenReturn(CATEGORY);

    StringWriter stringWriter = new StringWriter();
    PrintWriter writer = new PrintWriter(stringWriter);
    when(response.getWriter()).thenReturn(writer);
    new ClusterlyDataServlet().doGet(request, response);

    writer.flush();
    Gson gson = new Gson();
    Cluster[] clusters = gson.fromJson(stringWriter.toString(), Cluster[].class);
    assertTrue(clusters != null);
    assertTrue(clusters[0].title instanceof String);
    assertTrue(clusters[0].queriesToDisplay instanceof TrendsQuery[]);
  }
}
