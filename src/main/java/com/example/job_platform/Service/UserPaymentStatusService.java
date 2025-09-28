package com.example.job_platform.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.UserPaymentStatusDTO;
import com.example.job_platform.Entity.UserPaymentStatus;
import com.example.job_platform.Repository.UserPaymentStatusRepository;

@Service
public class UserPaymentStatusService {

    @Autowired
    private UserPaymentStatusRepository userPaymentStatusRepository;

    public UserPaymentStatusDTO assignSubscriptionPlan(UserPaymentStatusDTO dto) {
        UserPaymentStatus paymentStatus = new UserPaymentStatus();
        paymentStatus.setUserId(dto.userId);
        paymentStatus.setPlanId(dto.planId);
        paymentStatus.setSubscriptionStart(dto.subscriptionStart);
        paymentStatus.setSubscriptionEnd(dto.subscriptionEnd);
        paymentStatus.setStatus(dto.status);

        UserPaymentStatus saved = userPaymentStatusRepository.save(paymentStatus);
        dto.id = saved.getId();
        dto.subscriptionStart = saved.getSubscriptionStart();
        dto.subscriptionEnd = saved.getSubscriptionEnd();
        dto.status = saved.getStatus();
        return dto;
    }

    public Optional<UserPaymentStatusDTO> getStatusByUserId(Long userId) {
        return userPaymentStatusRepository.findByUserId(userId).map(status -> {
            UserPaymentStatusDTO dto = new UserPaymentStatusDTO();
            dto.id = status.getId();
            dto.planId = status.getPlanId();
            dto.userId = status.getUserId();
            dto.subscriptionStart = status.getSubscriptionStart();
            dto.subscriptionEnd = status.getSubscriptionEnd();
            dto.status = status.getStatus();
            return dto;
        });
    }
}
