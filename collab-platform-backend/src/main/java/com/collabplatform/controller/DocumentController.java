package com.collabplatform.controller;

import com.collabplatform.dto.*;
import com.collabplatform.service.DocumentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    public ResponseEntity<DocumentResponse> createDocument(@Valid @RequestBody DocumentRequest request,
                                                           Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(documentService.createDocument(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getMyDocuments(Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(documentService.getUserDocuments(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocument(@PathVariable Long id, Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(documentService.getDocument(id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentResponse> updateDocument(@PathVariable Long id,
                                                           @RequestBody Map<String, String> body,
                                                           Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(documentService.updateDocument(id, body.get("content"), userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id, Authentication auth) {
        Long userId = getUserId(auth);
        documentService.deleteDocument(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/versions")
    public ResponseEntity<List<VersionResponse>> getVersions(@PathVariable Long id, Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(documentService.getVersionHistory(id, userId));
    }

    @PostMapping("/{id}/revert/{versionId}")
    public ResponseEntity<DocumentResponse> revertToVersion(@PathVariable Long id,
                                                             @PathVariable Long versionId,
                                                             Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(documentService.revertToVersion(id, versionId, userId));
    }

    @PostMapping("/{id}/collaborators")
    public ResponseEntity<Void> addCollaborator(@PathVariable Long id,
                                                 @RequestBody Map<String, String> body,
                                                 Authentication auth) {
        Long userId = getUserId(auth);
        documentService.addCollaborator(id, body.get("email"), userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/collaborators")
    public ResponseEntity<List<CollaboratorResponse>> getCollaborators(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getCollaborators(id));
    }

    private Long getUserId(Authentication auth) {
        return (Long) auth.getCredentials();
    }
}
