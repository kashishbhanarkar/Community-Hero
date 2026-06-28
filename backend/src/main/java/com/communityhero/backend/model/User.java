package com.communityhero.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private int points;
    private int reportsCount;
    private String password;
    private String role;

    public User(){

        this.role = "citizen";

    }

    public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public int getReportsCount() { return reportsCount; }
    public void setReportsCount(int reportsCount) { this.reportsCount = reportsCount; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}