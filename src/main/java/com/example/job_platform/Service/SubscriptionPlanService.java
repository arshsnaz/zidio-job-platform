package com.example.job_platform.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.SubscriptionPlanDTO;
import com.example.job_platform.Entity.SubscriptionPlan;
import com.example.job_platform.Repository.SubscriptionPlanRepository;

@Service
public class SubscriptionPlanService {

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    public List<SubscriptionPlanDTO> getAllSubscriptionPlan() {
        return subscriptionPlanRepository.findAll().stream().map(sub -> {
            SubscriptionPlanDTO dto = new SubscriptionPlanDTO();
            dto.id = sub.getId();
            dto.name = sub.getName();
            dto.price = sub.getPrice();
            dto.description = sub.getDescription();
            dto.durationInDays = sub.getDurationInDays();
            return dto;
        }).collect(Collectors.toList());
    }

    public SubscriptionPlanDTO getSubscriptionPlanById(Long id) {
        SubscriptionPlan sub = subscriptionPlanRepository.findById(id).orElse(null);
        if (sub != null) {
            SubscriptionPlanDTO dto = new SubscriptionPlanDTO();
            dto.id = sub.getId();
            dto.name = sub.getName();
            dto.price = sub.getPrice();
            dto.description = sub.getDescription();
            dto.durationInDays = sub.getDurationInDays();
            return dto;
        }
        return null;
    }

    public SubscriptionPlanDTO createSubscriptionPlan(SubscriptionPlanDTO dto) {
        SubscriptionPlan sub = new SubscriptionPlan();
        sub.setName(dto.name);
        sub.setPrice(dto.price);
        sub.setDescription(dto.description);
        sub.setDurationInDays(dto.durationInDays);
        subscriptionPlanRepository.save(sub);
        return dto;
    }
}
