package com.communityhero.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "issues")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String title;
    private String description;
    private String location;
    private String userEmail;
    private String reportedBy;
    private double latitude;
    private double longitude;
    private String severity;
    public String getReportedBy() {
		return reportedBy;
	}

	public void setReportedBy(String reportedBy) {
		this.reportedBy = reportedBy;
	}

	private String status;
    private String department;
    private int verifications;
    private String recommendedAction;

    private String estimatedResolutionTime;

    private String priorityLevel;
    private String priorityScore;
    private String aiConfidence;

    @Column(length = 1000)
    private String impactAssessment;

    public Issue() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getVerifications() { return verifications; }
    public void setVerifications(int verifications) { this.verifications = verifications; }
    
    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public String getEstimatedResolutionTime() {
        return estimatedResolutionTime;
    }

    public void setEstimatedResolutionTime(String estimatedResolutionTime) {
        this.estimatedResolutionTime = estimatedResolutionTime;
    }

    public String getPriorityLevel() {
        return priorityLevel;
    }

    public void setPriorityLevel(String priorityLevel) {
        this.priorityLevel = priorityLevel;
    }

    public String getImpactAssessment() {
        return impactAssessment;
    }

    public void setImpactAssessment(String impactAssessment) {
        this.impactAssessment = impactAssessment;
    }
    
    public String getPriorityScore() {
        return priorityScore;
    }

    public void setPriorityScore(String priorityScore) {
        this.priorityScore = priorityScore;
    }


    public String getAiConfidence() {
        return aiConfidence;
    }

    public void setAiConfidence(String aiConfidence) {
        this.aiConfidence = aiConfidence;
    }

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	
	public String getUserEmail() {
	    return userEmail;
	}

	public void setUserEmail(String userEmail) {
	    this.userEmail = userEmail;
	}
    
}
