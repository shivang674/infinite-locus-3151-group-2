package com.collabplatform.repository;

import com.collabplatform.model.Collaborator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CollaboratorRepository extends JpaRepository<Collaborator, Long> {
    List<Collaborator> findByDocumentId(Long documentId);
    Optional<Collaborator> findByDocumentIdAndUserId(Long documentId, Long userId);
    boolean existsByDocumentIdAndUserId(Long documentId, Long userId);
}
