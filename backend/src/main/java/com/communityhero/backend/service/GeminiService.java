package com.communityhero.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final HttpClient client = HttpClient.newHttpClient();


    public String analyzeIssue(String description, String selectedCategory) throws Exception {


        String prompt = """
       You are an AI Civic Response Agent.

Your role is to analyze citizen complaints and act as a smart municipal assistant.

You must:

1. Classify the civic issue
2. Decide urgency level
3. Estimate public impact
4. Identify responsible department
5. Generate a citizen-friendly complaint
6. Recommend the next action
7. Estimate resolution time

Return ONLY JSON.
        {
"category":"",
"severity":"",
"department":"",
"confidence":"",
"priorityScore":"",
"priorityLevel":"",
"recommendedAction":"",
"estimatedResolutionTime":"",
"impactAssessment":"",
"complaint":"",
"citizenAdvice":""
}


        Citizen Selected Category:
        %s


        Citizen Complaint:
        %s


        Severity rules:

        LOW:
        Small issue, low impact.

        MEDIUM:
        Needs repair but no danger.

        HIGH:
        Large issue, road blocking, many people affected.

        CRITICAL:
        Accident risk, flooding, burst pipeline, emergency.


        Priority:

        Low = 25
        Medium = 50
        High = 75
        Critical = 95

Citizen advice should explain what citizens can do until authorities resolve the issue.
       
        """.formatted(selectedCategory, description);



        String requestBody = """
        {
          "contents": [{
            "parts": [{
              "text": %s
            }]
          }]
        }
        """.formatted(toJsonString(prompt));



        String url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key="
        + apiKey;



        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(
                HttpRequest.BodyPublishers.ofString(
                requestBody,
                StandardCharsets.UTF_8))
                .build();



        HttpResponse<String> response =
                client.send(
                request,
                HttpResponse.BodyHandlers.ofString());



        String aiResponse;


        if(response.statusCode()!=200){

            aiResponse = """
            {
              "category":"%s",
              "severity":"Medium",
              "department":"Municipal Board",
              "confidence":"90%%",
              "priorityScore":"50",
              "priorityLevel":"Medium",
              "recommendedAction":"Inspect and resolve the issue.",
              "estimatedResolutionTime":"24-48 Hours",
              "impactAssessment":"Issue may affect citizens if ignored.",
              "complaint":"Citizen reported a civic issue."
            }
            """.formatted(selectedCategory);

        }

        else {

            aiResponse = response.body();

        }



        // FORCE OUR OWN DECISION

        String text = description.toLowerCase();


        String severity = "Medium";
        String score = "50";
        String level = "Medium";



        if(
            text.contains("accident") ||
            text.contains("flood") ||
            text.contains("burst") ||
            text.contains("emergency") ||
            text.contains("danger")
        ){

            severity="Critical";
            score="95";
            level="Critical";

        }


        else if(
            text.contains("big") ||
            text.contains("large") ||
            text.contains("deep") ||
            text.contains("major") ||
            text.contains("blocked") ||
            text.contains("many")
        ){

            severity="High";
            score="75";
            level="High";

        }


        else if(
            text.contains("small") ||
            text.contains("minor")
        ){

            severity="Low";
            score="25";
            level="Low";

        }



        // FIX JSON SPACING ISSUE

        aiResponse = aiResponse
        .replaceAll(
        "\"category\"\\s*:\\s*\"[^\"]*\"",
        "\"category\":\"" + selectedCategory + "\""
        )
        .replaceAll(
        "\"severity\"\\s*:\\s*\"[^\"]*\"",
        "\"severity\":\"" + severity + "\""
        )
        .replaceAll(
        "\"priorityScore\"\\s*:\\s*\"[^\"]*\"",
        "\"priorityScore\":\"" + score + "\""
        )
        .replaceAll(
        "\"priorityLevel\"\\s*:\\s*\"[^\"]*\"",
        "\"priorityLevel\":\"" + level + "\""
        );



        System.out.println("FINAL AI RESPONSE");
        System.out.println(aiResponse);



        return aiResponse;

    }



    private String toJsonString(String text){

        return "\"" +
        text.replace("\\","\\\\")
        .replace("\"","\\\"")
        .replace("\n","\\n")
        + "\"";

    }

}