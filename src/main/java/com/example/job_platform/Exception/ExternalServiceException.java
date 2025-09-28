package com.example.job_platform.Exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when external service calls fail
 */
public class ExternalServiceException extends JobPlatformException {

    private final String serviceName;

    public ExternalServiceException(String serviceName, String message) {
        super(
                "EXTERNAL_SERVICE_ERROR",
                String.format("External service '%s' error: %s", serviceName, message),
                "We're experiencing technical difficulties. Please try again later.",
                HttpStatus.SERVICE_UNAVAILABLE.value()
        );
        this.serviceName = serviceName;
    }

    public ExternalServiceException(String serviceName, String message, Throwable cause) {
        super(
                "EXTERNAL_SERVICE_ERROR",
                String.format("External service '%s' error: %s", serviceName, message),
                "We're experiencing technical difficulties. Please try again later.",
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                cause
        );
        this.serviceName = serviceName;
    }

    public String getServiceName() {
        return serviceName;
    }
}
