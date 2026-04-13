package com.collabplatform.repository;

import com.collabplatform.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByOwnerIdOrderByUpdatedAtDesc(Long ownerId);

    @Query("SELECT d FROM Document d JOIN Collaborator c ON c.document = d WHERE c.user.id = :userId ORDER BY d.updatedAt DESC")
    List<Document> findSharedDocuments(@Param("userId") Long userId);
}
