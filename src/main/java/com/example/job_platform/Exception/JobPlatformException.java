package com.example.job_platform.Exception;

/**
 * Base exception class for all custom business exceptions in the job platform
 */
public class JobPlatformException extends RuntimeException {

    private final String errorCode;
    private final String userMessage;
    private final int httpStatusCode;

    public JobPlatformException(String errorCode, String message, String userMessage, int httpStatusCode) {
        super(message);
        this.errorCode = errorCode;
        this.userMessage = userMessage;
        this.httpStatusCode = httpStatusCode;
    }

    public JobPlatformException(String errorCode, String message, String userMessage, int httpStatusCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.userMessage = userMessage;
        this.httpStatusCode = httpStatusCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getUserMessage() {
        return userMessage;
    }

    public int getHttpStatusCode() {
        return httpStatusCode;
    }
}
