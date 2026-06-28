package com.communityhero.backend.controller;

import com.communityhero.backend.model.Issue;
import com.communityhero.backend.repository.IssueRepository;
import com.communityhero.backend.repository.UserRepository;
import com.communityhero.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*")
public class IssueController {

    @Autowired
    private IssueRepository issueRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeminiService geminiService;

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    @PostMapping
    public Issue createIssue(@RequestBody Issue issue) {

        if(issue.getStatus() == null || issue.getStatus().isEmpty()) {
            issue.setStatus("Reported");
        }

        if(issue.getVerifications() == 0) {
            issue.setVerifications((int)(Math.random()*40)+5);
        }
        try {

            String aiResult = geminiService.analyzeIssue(
                issue.getDescription(),
                issue.getCategory()
            );

            System.out.println("AI RESULT");
            System.out.println(aiResult);

            issue.setAiConfidence("AI Generated");

        }
        catch(Exception e){

            System.out.println("AI failed");
        }

        Issue savedIssue = issueRepository.save(issue);

        if(issue.getUserEmail() != null) {

            userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(issue.getUserEmail()))
                .findFirst()
                .ifPresent(user -> {

                    user.setReportsCount(user.getReportsCount() + 1);

                    int points = 10;

                    if("critical".equalsIgnoreCase(issue.getSeverity())) {
                        points = 25;
                    }
                    else if("high".equalsIgnoreCase(issue.getSeverity())) {
                        points = 20;
                    }
                    else if("medium".equalsIgnoreCase(issue.getSeverity())) {
                        points = 15;
                    }

                    user.setPoints(user.getPoints() + points);

                    userRepository.save(user);

                });
        }

        return savedIssue;
    }
    
    @PutMapping("/{id}/verify")
    public Issue verifyIssue(@PathVariable Long id) {

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.setVerifications(issue.getVerifications() + 1);

        return issueRepository.save(issue);
    }

    @PostMapping("/analyze")
    public String analyzeIssue(@RequestBody Map<String, String> body) throws Exception {

        String description = body.get("description");
        String category = body.get("category");

        return geminiService.analyzeIssue(description, category);
    }
    
    @PutMapping("/{id}/status")
    public Issue updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String,String> body
    ) {

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        issue.setStatus(body.get("status"));

        return issueRepository.save(issue);
    }
}