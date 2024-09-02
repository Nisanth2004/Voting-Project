package com.voting.controller;

import com.voting.entity.security.MLA;
import com.voting.service.mla.MlaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mla")
public class MlaController {

    @Autowired
    private MlaService mlaService;

    // Fetch MLA details by ID
    @GetMapping("/details/{id}")
    public MLA getMlaDetails(@PathVariable Long id) {
        return mlaService.getMlaById(id);
    }

    // You can also fetch by email
    @GetMapping("/details")
    public MLA getMlaDetailsByEmail(@RequestParam String email) {
        return mlaService.getMlaByEmail(email);
    }
}
