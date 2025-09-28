package com.example.job_platform.Service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.EmailRequest;
import com.example.job_platform.Entity.Application;
import com.example.job_platform.Entity.JobPost;
import com.example.job_platform.Entity.User;
import com.example.job_platform.Repository.ApplicationRepository;
import com.example.job_platform.Repository.UserRepository;

@Service
public class NotificationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private EmailService emailService;

    public void notifyJobApplication(Long jobId, Long studentId, Long recruiterId) {
        try {
            User student = userRepository.findById(studentId).orElse(null);
            User recruiter = userRepository.findById(recruiterId).orElse(null);

            if (student != null && recruiter != null) {
                // Notify recruiter about new application
                String recruiterSubject = "New Job Application Received";
                String recruiterMessage = String.format(
                        "Dear %s,\\n\\n"
                        + "You have received a new job application from %s.\\n"
                        + "Please log in to your dashboard to review the application.\\n\\n"
                        + "Best regards,\\n"
                        + "ZIDIO Connect Team",
                        recruiter.getName(),
                        student.getName()
                );

                EmailRequest recruiterEmail = new EmailRequest();
                recruiterEmail.setTo(recruiter.getEmail());
                recruiterEmail.setSubject(recruiterSubject);
                recruiterEmail.setBody(recruiterMessage);
                emailService.sendEmail(recruiterEmail);

                // Notify student about application submission
                String studentSubject = "Job Application Submitted Successfully";
                String studentMessage = String.format(
                        "Dear %s,\\n\\n"
                        + "Your job application has been submitted successfully.\\n"
                        + "We will notify you once the recruiter reviews your application.\\n\\n"
                        + "Best regards,\\n"
                        + "ZIDIO Connect Team",
                        student.getName()
                );

                EmailRequest studentEmail = new EmailRequest();
                studentEmail.setTo(student.getEmail());
                studentEmail.setSubject(studentSubject);
                studentEmail.setBody(studentMessage);
                emailService.sendEmail(studentEmail);
            }
        } catch (Exception e) {
            System.err.println("Error sending application notification: " + e.getMessage());
        }
    }

    public void notifyApplicationStatusUpdate(Long applicationId, String newStatus) {
        try {
            Application application = applicationRepository.findById(applicationId).orElse(null);

            if (application != null && application.getStudent() != null) {
                User student = application.getStudent().getUser();

                if (student != null) {
                    String subject = "Application Status Update";
                    String message = String.format(
                            "Dear %s,\\n\\n"
                            + "Your job application status has been updated to: %s\\n"
                            + "Please log in to your dashboard for more details.\\n\\n"
                            + "Best regards,\\n"
                            + "ZIDIO Connect Team",
                            student.getName(),
                            newStatus
                    );

                    EmailRequest emailRequest = new EmailRequest();
                    emailRequest.setTo(student.getEmail());
                    emailRequest.setSubject(subject);
                    emailRequest.setBody(message);
                    emailService.sendEmail(emailRequest);
                }
            }
        } catch (Exception e) {
            System.err.println("Error sending status update notification: " + e.getMessage());
        }
    }

    public void notifyNewJobPosted(JobPost jobPost) {
        try {
            if (jobPost != null) {
                // Get all students (would need to implement findByRole in UserRepository)
                List<User> allUsers = userRepository.findAll();

                String subject = "New Job Opportunity Available";
                String message = String.format(
                        "Dear Student,\\n\\n"
                        + "A new job opportunity has been posted that might interest you:\\n\\n"
                        + "Job Title: %s\\n"
                        + "Company: %s\\n"
                        + "Location: %s\\n"
                        + "Type: %s\\n\\n"
                        + "Log in to ZIDIO Connect to view details and apply.\\n\\n"
                        + "Best regards,\\n"
                        + "ZIDIO Connect Team",
                        jobPost.getTitle(),
                        jobPost.getRecruiter() != null ? jobPost.getRecruiter().getCompanyName() : "N/A",
                        jobPost.getLocation(),
                        jobPost.getType()
                );

                for (User user : allUsers) {
                    // Only send to students (you might want to check role)
                    EmailRequest emailRequest = new EmailRequest();
                    emailRequest.setTo(user.getEmail());
                    emailRequest.setSubject(subject);
                    emailRequest.setBody(message);
                    emailService.sendEmail(emailRequest);
                }
            }
        } catch (Exception e) {
            System.err.println("Error sending new job notification: " + e.getMessage());
        }
    }

    public void notifyWelcomeMessage(User user) {
        try {
            if (user != null) {
                String subject = "Welcome to ZIDIO Connect!";
                String message = String.format(
                        "Dear %s,\\n\\n"
                        + "Welcome to ZIDIO Connect - Your Gateway to Career Success!\\n\\n"
                        + "Your account has been successfully created. You can now:\\n"
                        + "- Browse internship and job opportunities\\n"
                        + "- Apply to positions that match your skills\\n"
                        + "- Track your application status\\n"
                        + "- Connect with top recruiters\\n\\n"
                        + "Start your journey today by logging in to your dashboard.\\n\\n"
                        + "Best regards,\\n"
                        + "ZIDIO Connect Team",
                        user.getName()
                );

                EmailRequest emailRequest = new EmailRequest();
                emailRequest.setTo(user.getEmail());
                emailRequest.setSubject(subject);
                emailRequest.setBody(message);
                emailService.sendEmail(emailRequest);
            }
        } catch (Exception e) {
            System.err.println("Error sending welcome notification: " + e.getMessage());
        }
    }

    public void notifyPaymentConfirmation(User user, String subscriptionType, Double amount) {
        try {
            if (user != null) {
                String subject = "Payment Confirmation - ZIDIO Connect";
                String message = String.format(
                        "Dear %s,\\n\\n"
                        + "Thank you for your payment. Your transaction has been processed successfully.\\n\\n"
                        + "Payment Details:\\n"
                        + "Subscription: %s\\n"
                        + "Amount: $%.2f\\n"
                        + "Date: %s\\n\\n"
                        + "Your premium features are now active.\\n\\n"
                        + "Best regards,\\n"
                        + "ZIDIO Connect Team",
                        user.getName(),
                        subscriptionType,
                        amount,
                        new Date().toString()
                );

                EmailRequest emailRequest = new EmailRequest();
                emailRequest.setTo(user.getEmail());
                emailRequest.setSubject(subject);
                emailRequest.setBody(message);
                emailService.sendEmail(emailRequest);
            }
        } catch (Exception e) {
            System.err.println("Error sending payment confirmation: " + e.getMessage());
        }
    }

    public void sendBulkNotification(String subject, String message) {
        try {
            List<User> allUsers = userRepository.findAll();

            for (User user : allUsers) {
                String personalizedMessage = String.format(
                        "Dear %s,\\n\\n%s\\n\\nBest regards,\\n"
                        + "ZIDIO Connect Team",
                        user.getName(),
                        message
                );

                EmailRequest emailRequest = new EmailRequest();
                emailRequest.setTo(user.getEmail());
                emailRequest.setSubject(subject);
                emailRequest.setBody(personalizedMessage);
                emailService.sendEmail(emailRequest);
            }
        } catch (Exception e) {
            System.err.println("Error sending bulk notification: " + e.getMessage());
        }
    }

    public void notifySystemMaintenance(String maintenanceMessage) {
        try {
            List<User> allUsers = userRepository.findAll();

            String subject = "System Maintenance Notification";

            for (User user : allUsers) {
                String message = String.format(
                        "Dear %s,\\n\\n%s\\n\\n"
                        + "We apologize for any inconvenience this may cause.\\n\\n"
                        + "Best regards,\\n"
                        + "ZIDIO Connect Team",
                        user.getName(),
                        maintenanceMessage
                );

                EmailRequest emailRequest = new EmailRequest();
                emailRequest.setTo(user.getEmail());
                emailRequest.setSubject(subject);
                emailRequest.setBody(message);
                emailService.sendEmail(emailRequest);
            }
        } catch (Exception e) {
            System.err.println("Error sending maintenance notification: " + e.getMessage());
        }
    }
}
