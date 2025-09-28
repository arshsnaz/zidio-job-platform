package com.example.job_platform.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.DTO.RecruiterDTO;
import com.example.job_platform.Service.RecruiterService;

@RestController
@RequestMapping("/api/recruiters")
public class RecruiterController {

    @Autowired
    private RecruiterService recruiterService;

    @PostMapping("/register")
    public ResponseEntity<RecruiterDTO> register(@RequestBody RecruiterDTO dto) {
        return ResponseEntity.ok(recruiterService.createOrUpdateRecruiter(dto));
    }

    @GetMapping("/{email}")
    public ResponseEntity<RecruiterDTO> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(recruiterService.getRecruiterByEmail(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecruiterDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(recruiterService.getRecruiterById(id));
    }

}
