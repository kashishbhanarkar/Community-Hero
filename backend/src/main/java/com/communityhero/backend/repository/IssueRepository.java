package com.communityhero.backend.repository;

import com.communityhero.backend.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueRepository extends JpaRepository<Issue, Long> {
}