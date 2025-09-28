package com.example.job_platform.Exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a business rule is violated
 */
public class BusinessRuleException extends JobPlatformException {

    public BusinessRuleException(String rule, String message) {
        super(
                "BUSINESS_RULE_VIOLATION",
                String.format("Business rule '%s' violated: %s", rule, message),
                message,
                HttpStatus.CONFLICT.value()
        );
    }

    public BusinessRuleException(String message) {
        super(
                "BUSINESS_RULE_VIOLATION",
                message,
                message,
                HttpStatus.CONFLICT.value()
        );
    }
}
