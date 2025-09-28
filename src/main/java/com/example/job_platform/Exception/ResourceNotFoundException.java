package com.example.job_platform.Exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a requested resource is not found
 */
public class ResourceNotFoundException extends JobPlatformException {

    public ResourceNotFoundException(String resourceType, String identifier) {
        super(
                "RESOURCE_NOT_FOUND",
                String.format("%s with identifier '%s' not found", resourceType, identifier),
                String.format("The requested %s could not be found", resourceType.toLowerCase()),
                HttpStatus.NOT_FOUND.value()
        );
    }

    public ResourceNotFoundException(String resourceType, Long id) {
        this(resourceType, String.valueOf(id));
    }
}
