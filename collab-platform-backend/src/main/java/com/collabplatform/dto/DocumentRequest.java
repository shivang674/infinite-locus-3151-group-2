package com.collabplatform.dto;

import jakarta.validation.constraints.NotBlank;

public record DocumentRequest(
    @NotBlank String title,
    String content
) {}
