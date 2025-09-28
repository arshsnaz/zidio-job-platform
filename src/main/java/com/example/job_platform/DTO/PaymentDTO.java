package com.example.job_platform.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.job_platform.Enum.PaymentStatus;
import com.example.job_platform.Enum.PaymentType;

public class PaymentDTO {

    private Long id;
    private Long userId;
    private Long planId;
    private String userEmail;
    private PaymentType paymentType;
    private PaymentStatus paymentStatus;
    private BigDecimal amount;
    private String currency;
    private String transactionId;
    private LocalDateTime paymentDate;

    // Constructors
    public PaymentDTO() {
    }

    public PaymentDTO(Long id, Long userId, Long planId, String userEmail, PaymentType paymentType, PaymentStatus paymentStatus, BigDecimal amount, String currency, String transactionId, LocalDateTime paymentDate) {
        this.id = id;
        this.userId = userId;
        this.planId = planId;
        this.userEmail = userEmail;
        this.paymentType = paymentType;
        this.paymentStatus = paymentStatus;
        this.amount = amount;
        this.currency = currency;
        this.transactionId = transactionId;
        this.paymentDate = paymentDate;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public PaymentType getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
}
