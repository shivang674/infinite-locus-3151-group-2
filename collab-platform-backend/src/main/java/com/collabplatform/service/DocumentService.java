package com.collabplatform.service;

import com.collabplatform.dto.CollaboratorResponse;
import com.collabplatform.dto.DocumentRequest;
import com.collabplatform.dto.DocumentResponse;
import com.collabplatform.dto.VersionResponse;
import com.collabplatform.model.Collaborator;
import com.collabplatform.model.Document;
import com.collabplatform.model.DocumentVersion;
import com.collabplatform.model.User;
import com.collabplatform.repository.CollaboratorRepository;
import com.collabplatform.repository.DocumentRepository;
import com.collabplatform.repository.DocumentVersionRepository;
import com.collabplatform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentVersionRepository versionRepository;
    private final CollaboratorRepository collaboratorRepository;
    private final UserRepository userRepository;

    public DocumentService(DocumentRepository documentRepository,
                          DocumentVersionRepository versionRepository,
                          CollaboratorRepository collaboratorRepository,
                          UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.versionRepository = versionRepository;
        this.collaboratorRepository = collaboratorRepository;
        this.userRepository = userRepository;
    }

    public DocumentResponse createDocument(DocumentRequest request, Long userId) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String initialContent = request.content() != null ? request.content() : "";
        Document doc = new Document(request.title(), initialContent, owner);
        documentRepository.save(doc);

        return toResponse(doc);
    }

    public List<DocumentResponse> getUserDocuments(Long userId) {
        List<Document> owned = documentRepository.findByOwnerIdOrderByUpdatedAtDesc(userId);
        List<Document> shared = documentRepository.findSharedDocuments(userId);

        List<DocumentResponse> result = new ArrayList<>();
        for (Document d : owned) {
            result.add(toResponse(d));
        }
        for (Document d : shared) {
            result.add(toResponse(d));
        }
        return result;
    }

    public DocumentResponse getDocument(Long docId, Long userId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!hasAccess(doc, userId)) {
            throw new RuntimeException("Access denied");
        }

        return toResponse(doc);
    }

    @Transactional
    public DocumentResponse updateDocument(Long docId, String content, Long userId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!hasAccess(doc, userId)) {
            throw new RuntimeException("Access denied");
        }

        User editor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (doc.getContent() != null && !doc.getContent().isEmpty()) {
            DocumentVersion version = new DocumentVersion(doc, doc.getContent(), editor.getFullName());
            versionRepository.save(version);
        }

        doc.setContent(content);
        documentRepository.save(doc);
        return toResponse(doc);
    }

    public void deleteDocument(Long docId, Long userId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!doc.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Only the owner can delete this document");
        }

        List<DocumentVersion> versions = versionRepository.findByDocumentIdOrderByCreatedAtDesc(docId);
        versionRepository.deleteAll(versions);

        List<Collaborator> collabs = collaboratorRepository.findByDocumentId(docId);
        collaboratorRepository.deleteAll(collabs);

        documentRepository.delete(doc);
    }

    public List<VersionResponse> getVersionHistory(Long docId, Long userId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!hasAccess(doc, userId)) {
            throw new RuntimeException("Access denied");
        }

        List<DocumentVersion> versions = versionRepository.findByDocumentIdOrderByCreatedAtDesc(docId);
        List<VersionResponse> result = new ArrayList<>();
        for (DocumentVersion v : versions) {
            result.add(new VersionResponse(v.getId(), v.getContent(), v.getEditedBy(), v.getCreatedAt()));
        }
        return result;
    }

    @Transactional
    public DocumentResponse revertToVersion(Long docId, Long versionId, Long userId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!hasAccess(doc, userId)) {
            throw new RuntimeException("Access denied");
        }

        DocumentVersion version = versionRepository.findById(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        User editor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DocumentVersion snapshot = new DocumentVersion(doc, doc.getContent(), editor.getFullName());
        versionRepository.save(snapshot);

        doc.setContent(version.getContent());
        documentRepository.save(doc);

        return toResponse(doc);
    }

    public void addCollaborator(Long docId, String email, Long userId) {
        Document doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!doc.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Only the owner can add collaborators");
        }

        User collaboratorUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User with that email not found"));

        if (collaboratorUser.getId().equals(userId)) {
            throw new RuntimeException("Cannot add yourself as a collaborator");
        }

        if (collaboratorRepository.existsByDocumentIdAndUserId(docId, collaboratorUser.getId())) {
            throw new RuntimeException("User is already a collaborator");
        }

        Collaborator collab = new Collaborator(doc, collaboratorUser, "EDITOR");
        collaboratorRepository.save(collab);
    }

    public List<CollaboratorResponse> getCollaborators(Long docId) {
        List<Collaborator> collabs = collaboratorRepository.findByDocumentId(docId);
        List<CollaboratorResponse> result = new ArrayList<>();
        for (Collaborator c : collabs) {
            result.add(new CollaboratorResponse(
                c.getId(),
                c.getUser().getId(),
                c.getUser().getFullName(),
                c.getUser().getEmail(),
                c.getRole()
            ));
        }
        return result;
    }

    private boolean hasAccess(Document doc, Long userId) {
        if (doc.getOwner().getId().equals(userId)) {
            return true;
        }
        return collaboratorRepository.existsByDocumentIdAndUserId(doc.getId(), userId);
    }

    private DocumentResponse toResponse(Document doc) {
        return new DocumentResponse(
            doc.getId(),
            doc.getTitle(),
            doc.getContent(),
            doc.getOwner().getFullName(),
            doc.getOwner().getId(),
            doc.getCreatedAt(),
            doc.getUpdatedAt()
        );
    }
}
