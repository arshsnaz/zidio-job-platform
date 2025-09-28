package com.example.job_platform.Service;

import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

@Service
public class ValidationService {

    private static final Pattern EMAIL_PATTERN
            = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    private static final Pattern PHONE_PATTERN
            = Pattern.compile("^[+]?[1-9]\\d{1,14}$");

    private static final Pattern PASSWORD_PATTERN
            = Pattern.compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$");

    public boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public boolean isValidPhoneNumber(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone).matches();
    }

    public boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }

    public boolean isValidName(String name) {
        return name != null && !name.trim().isEmpty() && name.length() >= 2 && name.length() <= 50;
    }

    public boolean isValidJobTitle(String title) {
        return title != null && !title.trim().isEmpty() && title.length() >= 3 && title.length() <= 100;
    }

    public boolean isValidCompanyName(String company) {
        return company != null && !company.trim().isEmpty() && company.length() >= 2 && company.length() <= 100;
    }

    public boolean isValidSalaryRange(Double minSalary, Double maxSalary) {
        return minSalary != null && maxSalary != null
                && minSalary >= 0 && maxSalary >= minSalary && maxSalary <= 10000000;
    }

    public boolean isValidExperience(Integer experience) {
        return experience != null && experience >= 0 && experience <= 50;
    }

    public String validateUserRegistration(String name, String email, String password) {
        if (!isValidName(name)) {
            return "Invalid name. Name must be 2-50 characters long.";
        }
        if (!isValidEmail(email)) {
            return "Invalid email format.";
        }
        if (!isValidPassword(password)) {
            return "Password must be at least 8 characters with uppercase, lowercase, number and special character.";
        }
        return null; // Valid
    }

    public String validateJobPost(String title, String company, Double minSalary, Double maxSalary) {
        if (!isValidJobTitle(title)) {
            return "Job title must be 3-100 characters long.";
        }
        if (!isValidCompanyName(company)) {
            return "Company name must be 2-100 characters long.";
        }
        if (!isValidSalaryRange(minSalary, maxSalary)) {
            return "Invalid salary range. Min salary must be less than max salary.";
        }
        return null; // Valid
    }
}
