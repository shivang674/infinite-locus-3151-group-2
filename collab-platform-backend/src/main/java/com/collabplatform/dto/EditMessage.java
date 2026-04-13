package com.collabplatform.dto;

public record EditMessage(
    Long documentId,
    String content,
    Long userId,
    String userName
) {}
