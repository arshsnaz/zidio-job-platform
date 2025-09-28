package com.example.job_platform.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.job_platform.DTO.StudentDTO;
import com.example.job_platform.Entity.Student;
import com.example.job_platform.Entity.User;
import com.example.job_platform.Repository.StudentRepository;
import com.example.job_platform.Repository.UserRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public StudentDTO createOrUpdateStudent(StudentDTO dto) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(dto.getEmail());
            if (!userOpt.isPresent()) {
                throw new RuntimeException("User not found with email: " + dto.getEmail());
            }

            User user = userOpt.get();
            Student student = studentRepository.findByUser(user).orElse(new Student());

            student.setUser(user);
            student.setSkills(dto.getSkills());
            student.setEducation(dto.getEducation());
            student.setResumeUrl(dto.getResumeUrl());

            Student savedStudent = studentRepository.save(student);
            return mapToDTO(savedStudent);

        } catch (Exception e) {
            throw new RuntimeException("Error creating/updating student: " + e.getMessage());
        }
    }

    public StudentDTO getStudentByEmail(String email) {
        try {
            Optional<Student> student = studentRepository.findByUserEmail(email);
            if (!student.isPresent()) {
                throw new RuntimeException("Student not found with email: " + email);
            }
            return mapToDTO(student.get());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching student: " + e.getMessage());
        }
    }

    public StudentDTO getStudentById(Long id) {
        try {
            Optional<Student> student = studentRepository.findById(id);
            if (!student.isPresent()) {
                throw new RuntimeException("Student not found with id: " + id);
            }
            return mapToDTO(student.get());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching student: " + e.getMessage());
        }
    }

    private StudentDTO mapToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getUser().getName());
        dto.setEmail(student.getUser().getEmail());
        dto.setSkills(student.getSkills());
        dto.setEducation(student.getEducation());
        dto.setResumeUrl(student.getResumeUrl());
        return dto;
    }
}
