package com.example.job_platform.DTO;

public class SubscriptionPlanDTO {

    public Long id;
    public String name;
    public Double price;
    public String description;
    public Integer durationInDays;

    public SubscriptionPlanDTO() {
    }

    public SubscriptionPlanDTO(Long id, String name, String description, Double price, Integer durationInDays) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.durationInDays = durationInDays;
    }
}
