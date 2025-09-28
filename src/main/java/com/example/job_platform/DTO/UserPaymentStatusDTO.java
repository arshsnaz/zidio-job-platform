package com.example.job_platform.DTO;

import java.time.LocalDate;

import com.example.job_platform.Enum.PaidStatus;

public class UserPaymentStatusDTO {
	public Long id;
	public Long planId;
	public Long userId;
	public LocalDate subscriptionStart;
	public LocalDate subscriptionEnd;
	public PaidStatus status;
	

	public UserPaymentStatusDTO() {}
	public UserPaymentStatusDTO(Long id,Long planId,Long userId,LocalDate subscriptionStart,LocalDate subscriptionEnd,PaidStatus status) {
		this.id=id;
		this.planId=planId;
		this.userId=userId;
		this.subscriptionStart=subscriptionStart;
		this.subscriptionEnd=subscriptionEnd;
		this.status=status;
		
	}

}
