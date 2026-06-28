package com.communityhero.backend.controller;

import com.communityhero.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin(origins = "http://localhost:5173")
public class GeminiController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/analyze")
    public String analyze(@RequestBody Map<String, String> request) throws Exception {

        String description = request.get("description");
        String category = request.get("category");

        return geminiService.analyzeIssue(description, category);
    }
}