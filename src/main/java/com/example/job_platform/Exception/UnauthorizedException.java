package com.example.job_platform.Exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when user is not authorized to perform an action
 */
public class UnauthorizedException extends JobPlatformException {

    public UnauthorizedException(String action) {
        super(
                "UNAUTHORIZED_ACCESS",
                String.format("User is not authorized to %s", action),
                "You are not authorized to perform this action",
                HttpStatus.UNAUTHORIZED.value()
        );
    }

    public UnauthorizedException(String action, String reason) {
        super(
                "UNAUTHORIZED_ACCESS",
                String.format("User is not authorized to %s: %s", action, reason),
                "You are not authorized to perform this action",
                HttpStatus.UNAUTHORIZED.value()
        );
    }
}
