package com.voting.repository;

import com.voting.entity.MLA;
import com.voting.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MLARepository extends JpaRepository<MLA, Long> {
    MLA findByEmail(String email);

}