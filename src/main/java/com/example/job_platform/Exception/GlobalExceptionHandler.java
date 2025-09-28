package com.example.job_platform.Exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.example.job_platform.Service.LoggingService;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired(required = false)
    private LoggingService loggingService;

    @ExceptionHandler(JobPlatformException.class)
    public ResponseEntity<ErrorResponse> handleJobPlatformException(JobPlatformException ex, WebRequest request) {
        logError(ex, request);

        ErrorResponse errorResponse = new ErrorResponse(
                ex.getErrorCode(),
                ex.getUserMessage(),
                LocalDateTime.now(),
                request.getDescription(false)
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.valueOf(ex.getHttpStatusCode()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        logError(ex, request);

        ErrorResponse errorResponse = new ErrorResponse(
                ex.getErrorCode(),
                ex.getUserMessage(),
                LocalDateTime.now(),
                request.getDescription(false)
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex, WebRequest request) {
        logError(ex, request);

        ErrorResponse errorResponse = new ErrorResponse(
                ex.getErrorCode(),
                ex.getUserMessage(),
                LocalDateTime.now(),
                request.getDescription(false)
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException ex, WebRequest request) {
        logError(ex, request);

        ErrorResponse errorResponse = new ErrorResponse(
                ex.getErrorCode(),
                ex.getUserMessage(),
                LocalDateTime.now(),
                request.getDescription(false)
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ErrorResponse> handleBusinessRuleException(BusinessRuleException ex, WebRequest request) {
        logError(ex, request);

        ErrorResponse errorResponse = new ErrorResponse(
                ex.getErrorCode(),
                ex.getUserMessage(),
                LocalDateTime.now(),
                request.getDescription(false)
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ErrorResponse> handleExternalServiceException(ExternalServiceException ex, WebRequest request) {
        logError(ex, request);

        ErrorResponse errorResponse = new ErrorResponse(
                ex.getErrorCode(),
                ex.getUserMessage(),
                LocalDateTime.now(),
                request.getDescription(false)
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        logError(ex, request);

        ErrorResponse errorResponse = new ErrorResponse(
                "INTERNAL_SERVER_ERROR",
                "An unexpected error occurred. Please try again later.",
                LocalDateTime.now(),
                request.getDescription(false)
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void logError(Exception ex, WebRequest request) {
        try {
            if (loggingService != null) {
                Map<String, Object> context = new HashMap<>();
                context.put("request", request.getDescription(false));
                context.put("exceptionType", ex.getClass().getSimpleName());

                if (ex instanceof JobPlatformException) {
                    JobPlatformException jpEx = (JobPlatformException) ex;
                    context.put("errorCode", jpEx.getErrorCode());
                    context.put("httpStatusCode", jpEx.getHttpStatusCode());
                }

                loggingService.error("Exception handled by GlobalExceptionHandler", ex, context);
            } else {
                // Fallback logging
                System.err.printf("[ERROR] %s: %s - Request: %s%n",
                        ex.getClass().getSimpleName(), ex.getMessage(), request.getDescription(false));
                ex.printStackTrace();
            }
        } catch (Exception loggingException) {
            // Don't let logging failures break exception handling
            System.err.println("Failed to log exception: " + loggingException.getMessage());
            ex.printStackTrace();
        }
    }

    public static class ErrorResponse {

        private final String errorCode;
        private final String message;
        private final LocalDateTime timestamp;
        private final String path;

        public ErrorResponse(String errorCode, String message, LocalDateTime timestamp, String path) {
            this.errorCode = errorCode;
            this.message = message;
            this.timestamp = timestamp;
            this.path = path;
        }

        // Getters
        public String getErrorCode() {
            return errorCode;
        }

        public String getMessage() {
            return message;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public String getPath() {
            return path;
        }
    }
}
