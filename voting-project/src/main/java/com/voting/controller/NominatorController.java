package com.voting.controller.nominy;

import com.voting.entity.nominy.Nominator;
import com.voting.service.nominy.NominatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/nominator")
public class NominatorController {

    private final NominatorService nominatorService;

    @Autowired
    public NominatorController(NominatorService nominatorService) {
        this.nominatorService = nominatorService;
    }

    // add the nominny
    @PostMapping("/nominate")
    public ResponseEntity<String> nominate(
            @RequestParam("name") String name,
            @RequestParam("age") Integer age,
            @RequestParam("email") String email,
            @RequestParam("aadharNumber") Integer aadharNumber,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("nativityCertificate") MultipartFile nativityCertificate) {

        try {
            Nominator nominator = nominatorService.saveNominator(name, age, email, aadharNumber, photo, nativityCertificate);

            // Here you might store the ID or any other relevant information to associate with the payment.
            // For simplicity, let's assume you pass the nominator ID to the client.
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

    // Get all nominators
    @GetMapping
    public ResponseEntity<List<Nominator>> getAllNominators() {
        List<Nominator> nominators = nominatorService.findAllNominators();
        if (nominators != null && !nominators.isEmpty()) {

            return new ResponseEntity<>(nominators, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

}
