package com.example.job_platform.Controller;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.job_platform.Service.LoggingService;
import com.example.job_platform.Service.WorkflowService;
import com.example.job_platform.Service.WorkflowService.WorkflowAction;
import com.example.job_platform.Service.WorkflowService.WorkflowState;
import com.example.job_platform.Service.WorkflowService.WorkflowTransition;

@RestController
@RequestMapping("/api/workflow")
public class WorkflowController {

    @Autowired
    private WorkflowService workflowService;

    @Autowired
    private LoggingService loggingService;

    public static class WorkflowActionRequest {

        private Long applicationId;
        private WorkflowAction action;
        private String comments;

        // Default constructor
        public WorkflowActionRequest() {
        }

        // Constructor with all fields
        public WorkflowActionRequest(Long applicationId, WorkflowAction action, String comments) {
            this.applicationId = applicationId;
            this.action = action;
            this.comments = comments;
        }

        // Getters and setters
        public Long getApplicationId() {
            return applicationId;
        }

        public void setApplicationId(Long applicationId) {
            this.applicationId = applicationId;
        }

        public WorkflowAction getAction() {
            return action;
        }

        public void setAction(WorkflowAction action) {
            this.action = action;
        }

        public String getComments() {
            return comments;
        }

        public void setComments(String comments) {
            this.comments = comments;
        }
    }

    public static class BulkWorkflowRequest {

        private List<Long> applicationIds;
        private WorkflowAction action;
        private String comments;

        // Default constructor
        public BulkWorkflowRequest() {
        }

        // Constructor with all fields
        public BulkWorkflowRequest(List<Long> applicationIds, WorkflowAction action, String comments) {
            this.applicationIds = applicationIds;
            this.action = action;
            this.comments = comments;
        }

        // Getters and setters
        public List<Long> getApplicationIds() {
            return applicationIds;
        }

        public void setApplicationIds(List<Long> applicationIds) {
            this.applicationIds = applicationIds;
        }

        public WorkflowAction getAction() {
            return action;
        }

        public void setAction(WorkflowAction action) {
            this.action = action;
        }

        public String getComments() {
            return comments;
        }

        public void setComments(String comments) {
            this.comments = comments;
        }
    }

    @PostMapping("/initiate/{applicationId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<String> initiateWorkflow(@PathVariable Long applicationId) {
        try {
            workflowService.initiateApplicationWorkflow(applicationId);
            loggingService.logUserAction("API_USER", "WORKFLOW_INITIATE",
                    "Initiated workflow for application: " + applicationId);
            return ResponseEntity.ok("Workflow initiated successfully for application: " + applicationId);
        } catch (Exception e) {
            loggingService.error("Failed to initiate workflow via API", e);
            return ResponseEntity.badRequest().body("Failed to initiate workflow: " + e.getMessage());
        }
    }

    @PostMapping("/transition")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<String> transitionWorkflow(@RequestBody WorkflowActionRequest request) {
        try {
            WorkflowState currentState = workflowService.getCurrentState(request.getApplicationId());
            if (currentState == null) {
                return ResponseEntity.badRequest().body("No workflow found for application: " + request.getApplicationId());
            }

            WorkflowState newState = determineTargetState(currentState, request.getAction());
            if (newState == null) {
                return ResponseEntity.badRequest().body("Invalid action for current state: " + currentState);
            }

            workflowService.moveToState(request.getApplicationId(), newState, request.getAction(),
                    "API_USER", request.getComments());

            loggingService.logUserAction("API_USER", "WORKFLOW_TRANSITION",
                    String.format("Application %d transitioned to %s", request.getApplicationId(), newState));

            return ResponseEntity.ok(String.format("Application %d moved to %s successfully",
                    request.getApplicationId(), newState));
        } catch (Exception e) {
            loggingService.error("Failed to transition workflow via API", e);
            return ResponseEntity.badRequest().body("Failed to transition workflow: " + e.getMessage());
        }
    }

    @PostMapping("/bulk-process")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> bulkProcessApplications(@RequestBody BulkWorkflowRequest request) {
        try {
            workflowService.bulkProcessApplications(request.getApplicationIds(), request.getAction(),
                    "API_ADMIN", request.getComments());

            loggingService.logUserAction("API_ADMIN", "BULK_WORKFLOW_PROCESS",
                    String.format("Bulk processed %d applications with action: %s",
                            request.getApplicationIds().size(), request.getAction()));

            return ResponseEntity.ok(String.format("Successfully processed %d applications",
                    request.getApplicationIds().size()));
        } catch (Exception e) {
            loggingService.error("Failed to bulk process applications via API", e);
            return ResponseEntity.badRequest().body("Failed to bulk process applications: " + e.getMessage());
        }
    }

    @GetMapping("/status/{applicationId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER') or hasRole('STUDENT')")
    public ResponseEntity<Object> getWorkflowStatus(@PathVariable Long applicationId) {
        try {
            WorkflowState currentState = workflowService.getCurrentState(applicationId);
            if (currentState == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("applicationId", applicationId);
            response.put("currentState", currentState);
            response.put("stateName", getStateDisplayName(currentState));
            response.put("stateDescription", getStateDescription(currentState));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            loggingService.error("Failed to get workflow status via API", e);
            return ResponseEntity.badRequest().body("Failed to get workflow status: " + e.getMessage());
        }
    }

    @GetMapping("/history/{applicationId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<List<WorkflowTransition>> getWorkflowHistory(@PathVariable Long applicationId) {
        try {
            List<WorkflowTransition> history = workflowService.getWorkflowHistory(applicationId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            loggingService.error("Failed to get workflow history via API", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<WorkflowState, Long>> getWorkflowStatistics() {
        try {
            Map<WorkflowState, Long> stats = workflowService.getWorkflowStatistics();
            loggingService.logUserAction("API_ADMIN", "WORKFLOW_STATS_VIEW",
                    "Viewed workflow statistics");
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            loggingService.error("Failed to get workflow statistics via API", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/states")
    public ResponseEntity<Map<String, Object>> getAvailableStates() {
        try {
            Map<String, Object> stateInfo = new HashMap<>();
            stateInfo.put("states", WorkflowState.values());
            stateInfo.put("actions", WorkflowAction.values());
            stateInfo.put("stateDescriptions", getStateDescriptions());
            return ResponseEntity.ok(stateInfo);
        } catch (Exception e) {
            loggingService.error("Failed to get available states via API", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/next-actions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('RECRUITER')")
    public ResponseEntity<List<WorkflowAction>> getNextActions(@RequestParam Long applicationId) {
        try {
            WorkflowState currentState = workflowService.getCurrentState(applicationId);
            if (currentState == null) {
                return ResponseEntity.notFound().build();
            }

            List<WorkflowAction> availableActions = getAvailableActionsForState(currentState);
            return ResponseEntity.ok(availableActions);
        } catch (Exception e) {
            loggingService.error("Failed to get next actions via API", e);
            return ResponseEntity.badRequest().build();
        }
    }

    private WorkflowState determineTargetState(WorkflowState currentState, WorkflowAction action) {
        switch (action) {
            case APPROVE:
                return currentState == WorkflowState.FINAL_REVIEW ? WorkflowState.APPROVED : null;
            case REJECT:
                return WorkflowState.REJECTED;
            case PUT_ON_HOLD:
                return WorkflowState.ON_HOLD;
            case MOVE_TO_NEXT_STAGE:
                return getNextStage(currentState);
            default:
                return null;
        }
    }

    private WorkflowState getNextStage(WorkflowState currentState) {
        switch (currentState) {
            case INITIAL_REVIEW:
                return WorkflowState.TECHNICAL_SCREENING;
            case TECHNICAL_SCREENING:
                return WorkflowState.HR_INTERVIEW;
            case HR_INTERVIEW:
                return WorkflowState.TECHNICAL_INTERVIEW;
            case TECHNICAL_INTERVIEW:
                return WorkflowState.FINAL_REVIEW;
            case ON_HOLD:
                return WorkflowState.TECHNICAL_SCREENING;
            default:
                return null;
        }
    }

    private String getStateDisplayName(WorkflowState state) {
        switch (state) {
            case INITIAL_REVIEW:
                return "Initial Review";
            case TECHNICAL_SCREENING:
                return "Technical Screening";
            case HR_INTERVIEW:
                return "HR Interview";
            case TECHNICAL_INTERVIEW:
                return "Technical Interview";
            case FINAL_REVIEW:
                return "Final Review";
            case APPROVED:
                return "Approved";
            case REJECTED:
                return "Rejected";
            case ON_HOLD:
                return "On Hold";
            default:
                return state.toString();
        }
    }

    private String getStateDescription(WorkflowState state) {
        switch (state) {
            case INITIAL_REVIEW:
                return "Application is being reviewed for basic requirements";
            case TECHNICAL_SCREENING:
                return "Technical qualifications are being evaluated";
            case HR_INTERVIEW:
                return "HR interview scheduled or in progress";
            case TECHNICAL_INTERVIEW:
                return "Technical interview scheduled or in progress";
            case FINAL_REVIEW:
                return "Final decision being made";
            case APPROVED:
                return "Application has been approved";
            case REJECTED:
                return "Application has been rejected";
            case ON_HOLD:
                return "Application is on hold pending additional information";
            default:
                return "Current application status";
        }
    }

    private Map<WorkflowState, String> getStateDescriptions() {
        Map<WorkflowState, String> descriptions = new HashMap<>();
        descriptions.put(WorkflowState.INITIAL_REVIEW, "Initial review of application");
        descriptions.put(WorkflowState.TECHNICAL_SCREENING, "Technical skills evaluation");
        descriptions.put(WorkflowState.HR_INTERVIEW, "Human resources interview");
        descriptions.put(WorkflowState.TECHNICAL_INTERVIEW, "Technical interview with team");
        descriptions.put(WorkflowState.FINAL_REVIEW, "Final hiring decision");
        descriptions.put(WorkflowState.APPROVED, "Application approved");
        descriptions.put(WorkflowState.REJECTED, "Application rejected");
        descriptions.put(WorkflowState.ON_HOLD, "Application temporarily on hold");
        return descriptions;
    }

    private List<WorkflowAction> getAvailableActionsForState(WorkflowState state) {
        switch (state) {
            case INITIAL_REVIEW:
            case TECHNICAL_SCREENING:
            case HR_INTERVIEW:
            case TECHNICAL_INTERVIEW:
                return Arrays.asList(WorkflowAction.MOVE_TO_NEXT_STAGE, WorkflowAction.REJECT,
                        WorkflowAction.PUT_ON_HOLD);
            case FINAL_REVIEW:
                return Arrays.asList(WorkflowAction.APPROVE, WorkflowAction.REJECT);
            case ON_HOLD:
                return Arrays.asList(WorkflowAction.MOVE_TO_NEXT_STAGE, WorkflowAction.REJECT);
            case APPROVED:
            case REJECTED:
                return Collections.emptyList(); // No actions available for terminal states
            default:
                return Collections.emptyList();
        }
    }
}
