package com.collabplatform.dto;

import java.time.LocalDateTime;

public record DocumentResponse(
    Long id,
    String title,
    String content,
    String ownerName,
    Long ownerId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
