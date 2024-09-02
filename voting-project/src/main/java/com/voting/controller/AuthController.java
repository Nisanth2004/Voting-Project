package com.voting.controller;

import com.voting.dto.LoginRequest;
import com.voting.dto.SignupRequest;
import com.voting.entity.security.MLA;
import com.voting.service.mla.MlaService;
import com.voting.service.security.SignupService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final SignupService signupService;
    private final MlaService mlaService;
    private final AuthenticationManager authenticationManager;

    public AuthController(SignupService signupService, MlaService mlaService, AuthenticationManager authenticationManager) {
        this.signupService = signupService;
        this.mlaService = mlaService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest signupRequest) {
        signupService.signup(signupRequest.getRole(), signupRequest.getName(), signupRequest.getEmail(), signupRequest.getPassword());
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        System.out.println("Incoming login request: " + loginRequest);

        Authentication authenticationToken = new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), loginRequest.getPassword());

        try {
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            String role = authentication.getAuthorities().iterator().next().getAuthority();
            MLA mla = mlaService.getMlaByEmail(loginRequest.getEmail());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("role", role);
            response.put("mlaId", String.valueOf(mla.getId()));
            response.put("email", mla.getEmail());

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            System.out.println("Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }



    @GetMapping("/check")
    public ResponseEntity<?> checkAuthentication(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            // Check if the user has the 'ROLE_MLA' authority
            boolean hasMlaRole = authentication.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_MLA"));

            if (hasMlaRole) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403 Forbidden if not an MLA
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401 Unauthorized if not authenticated
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            System.out.println("User " + authentication.getName() + " logged out successfully.");
        } else {
            System.out.println("No authenticated user found during logout.");
        }

        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testAuthentication(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Security Context Authentication: " + authentication);

        Map<String, String> response = new HashMap<>();
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            response.put("message", "User is authenticated");
            response.put("username", authentication.getName());
        } else {
            response.put("message", "User is not authenticated");
        }

        HttpSession session = request.getSession(false);
        System.out.println("Session ID: " + (session != null ? session.getId() : "No session"));

        return ResponseEntity.ok(response);
    }


    @GetMapping("/logout-success")
    public ResponseEntity<Map<String, String>> logoutSuccess() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout Nisanth successful");
        return ResponseEntity.ok(response);
    }


}
