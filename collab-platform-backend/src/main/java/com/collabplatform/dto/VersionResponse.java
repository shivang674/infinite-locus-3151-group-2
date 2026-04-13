package com.collabplatform.dto;

import java.time.LocalDateTime;

public record VersionResponse(
    Long id,
    String content,
    String editedBy,
    LocalDateTime createdAt
) {}
