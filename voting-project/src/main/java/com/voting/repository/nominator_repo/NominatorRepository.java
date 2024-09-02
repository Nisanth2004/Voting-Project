package com.voting.repository.nominator_repo;

import com.voting.entity.nominy.Nominator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NominatorRepository extends JpaRepository<Nominator,Integer> {
}
