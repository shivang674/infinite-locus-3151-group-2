package com.collabplatform.dto;

public record CollaboratorResponse(
    Long id,
    Long userId,
    String userName,
    String userEmail,
    String role
) {}
