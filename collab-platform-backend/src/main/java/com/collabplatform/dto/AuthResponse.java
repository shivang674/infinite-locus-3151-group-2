package com.collabplatform.dto;

public record AuthResponse(
    String token,
    Long userId,
    String fullName,
    String email
) {}
