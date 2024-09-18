package com.voting.controller.nominy;

import com.voting.dto.PaymentStatusRequest;
import com.voting.entity.nominy.Nominator;
import com.voting.service.nominy.NominatorService;
import com.voting.service.nominy.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nominator")
public class NominatorController {

    private final NominatorService nominatorService;
    private final S3Service s3Service;

    @Autowired
    public NominatorController(NominatorService nominatorService, S3Service s3Service) {
        this.nominatorService = nominatorService;
        this.s3Service = s3Service;
    }

    @PostMapping("/nominate")
    public ResponseEntity<String> nominate(
            @RequestParam("name") String name,
            @RequestParam("age") Integer age,
            @RequestParam("email") String email,
            @RequestParam("aadharNumber") String aadharNumber,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("nativityCertificate") MultipartFile nativityCertificate) {

        // Validate aadharNumber
        if (!aadharNumber.matches("\\d{12}")) {
            return new ResponseEntity<>("Aadhar Number must be a 12-digit number", HttpStatus.BAD_REQUEST);
        }

        try {
            Nominator nominator = nominatorService.saveNominator(name, age, email, aadharNumber, photo, nativityCertificate);
            return new ResponseEntity<>(nominator.getId().toString(), HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error while saving nomination data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Nominator> getNominatorById(@PathVariable("id") Integer id) {
        Nominator nominator = nominatorService.findNominatorById(id);
        if (nominator != null) {
            return new ResponseEntity<>(nominator, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<List<Nominator>> getAllNominators() {
        List<Nominator> nominators = nominatorService.findAllNominators();
        if (nominators != null && !nominators.isEmpty()) {
            return new ResponseEntity<>(nominators, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PostMapping("/payment")
    public ResponseEntity<String> updatePaymentStatus(@RequestBody PaymentStatusRequest request) {
        Integer nominatorId = request.getNominatorId();
        String status = request.getStatus();
        nominatorService.updatePaymentStatus(nominatorId, status);
        return ResponseEntity.ok("Payment status updated successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateNominator(
            @PathVariable("id") Integer id,
            @RequestParam("name") String name,
            @RequestParam("age") Integer age,
            @RequestParam("email") String email,
            @RequestParam("aadharNumber") String aadharNumber,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {

        try {
            // Find the existing Nominator by ID
            Nominator nominator = nominatorService.findNominatorById(id);
            if (nominator == null) {
                return new ResponseEntity<>("Nominator not found", HttpStatus.NOT_FOUND);
            }

            // Update Nominator fields
            nominator.setName(name);
            nominator.setAge(age);
            nominator.setEmail(email);
            nominator.setAadharNumber(aadharNumber);

            // Handle photo upload if provided
            if (photo != null && !photo.isEmpty()) {
                try {
                    // Upload new photo to S3 and get the path
                    String photoPath = s3Service.uploadFile(photo);
                    nominator.setPhotoImagePath(photoPath); // Set new photo path in Nominator
                } catch (IOException e) {
                    return new ResponseEntity<>("Error uploading photo", HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }

            // Save the updated Nominator
            nominatorService.saveNominator(nominator);
            return new ResponseEntity<>("Nominator details updated", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Error updating nominator", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = nominatorService.isEmailExists(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-aadhar")
    public ResponseEntity<Map<String, Boolean>> checkAadhar(@RequestParam String aadhar) {
        boolean exists = nominatorService.isAadharExists(aadhar);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

}
