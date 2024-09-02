package com.voting.service.mla;

import com.voting.entity.security.MLA;
import com.voting.repository.security_repo.MLARepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MlaService {

    @Autowired
    private MLARepository mlaRepository;

    public MLA getMlaByEmail(String email) {
        Optional<MLA> mla = Optional.ofNullable(mlaRepository.findByEmail(email));
        return mla.orElseThrow(() -> new RuntimeException("MLA not found with email: " + email));
    }

    public MLA getMlaById(Long id) {
        Optional<MLA> mla = mlaRepository.findById(id);
        return mla.orElseThrow(() -> new RuntimeException("MLA not found with id: " + id));
    }


}
