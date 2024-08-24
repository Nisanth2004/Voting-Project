package com.voting.controller;

import com.voting.dto.LoginRequest;
import com.voting.dto.SignupRequest;
import java.util.HashMap;
import java.util.Map;
import com.voting.service.SignupService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("http://localhost:5173")
public class AuthController {

    private final  SignupService signupService;


    private final AuthenticationManager authenticationManager;


    public AuthController(SignupService signupService, AuthenticationManager authenticationManager) {
        this.signupService = signupService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest signupRequest) {
        signupService.signup(signupRequest.getRole(), signupRequest.getName(), signupRequest.getEmail(), signupRequest.getPassword());
        return ResponseEntity.ok("User registered successfully");
    }



    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Incoming login request: " + loginRequest);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), loginRequest.getPassword());

        try {
            Authentication authResult = authenticationManager.authenticate(authentication);
            SecurityContextHolder.getContext().setAuthentication(authResult); // Set authentication in context

            // Get the role
            String role = authResult.getAuthorities().iterator().next().getAuthority();

            // Create response map
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("role", role);
            System.out.println(role);
            // Return response map with the status 200 OK
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            System.out.println("Login failed: " + e.getMessage());
            // Return error response with status 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }




    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();
        request.getSession().invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }
}

