package com.example.job_platform.Entity;

import java.util.Date;
import javax.persistence.*;
import com.example.job_platform.Enum.Status;

@Entity
@Table(name="applications")
public class Application {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "student_id")
	private Student student;
	
	@ManyToOne
	@JoinColumn(name = "job_id")
	private JobPost job;
	
	@Enumerated(EnumType.STRING)
	private Status status;
	
	@Column(name = "applied_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date appliedDate;
	
	public Application() {
		this.appliedDate = new Date();
		this.status = Status.APPLIED;
	}
	
	public Application(Student student, JobPost job) {
		this.student = student;
		this.job = job;
		this.status = Status.APPLIED;
		this.appliedDate = new Date();
	}
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public Student getStudent() {
		return student;
	}
	
	public void setStudent(Student student) {
		this.student = student;
	}
	
	public JobPost getJob() {
		return job;
	}
	
	public void setJob(JobPost job) {
		this.job = job;
	}
	
	public Status getStatus() {
		return status;
	}
	
	public void setStatus(Status status) {
		this.status = status;
	}
	
	public Date getAppliedDate() {
		return appliedDate;
	}
	
	public void setAppliedDate(Date appliedDate) {
		this.appliedDate = appliedDate;
	}
}