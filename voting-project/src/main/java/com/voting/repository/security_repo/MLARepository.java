package com.voting.repository.security_repo;

import com.voting.entity.security.MLA;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MLARepository extends JpaRepository<MLA, Long> {
   MLA findByEmail(String email);

}