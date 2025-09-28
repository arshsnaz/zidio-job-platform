package com.example.job_platform.Exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when input validation fails
 */
public class ValidationException extends JobPlatformException {

    public ValidationException(String field, String message) {
        super(
                "VALIDATION_ERROR",
                String.format("Validation failed for field '%s': %s", field, message),
                String.format("Invalid %s: %s", field, message),
                HttpStatus.BAD_REQUEST.value()
        );
    }

    public ValidationException(String message) {
        super(
                "VALIDATION_ERROR",
                message,
                "The provided data is invalid",
                HttpStatus.BAD_REQUEST.value()
        );
    }
}
