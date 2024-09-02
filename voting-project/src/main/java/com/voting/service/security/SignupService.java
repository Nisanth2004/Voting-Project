package com.voting.service.security;

import com.voting.entity.security.Admin;
import com.voting.entity.security.MLA;
import com.voting.entity.security.User;
import com.voting.repository.security_repo.AdminRepository;
import com.voting.repository.security_repo.MLARepository;
import com.voting.repository.security_repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SignupService {

    private final MLARepository mlaRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public SignupService(MLARepository mlaRepository, UserRepository userRepository, AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.mlaRepository = mlaRepository;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void signup(String role, String name, String email, String password) {
        String encodedPassword = passwordEncoder.encode(password);

        if ("MLA".equalsIgnoreCase(role)) {
            MLA mla = new MLA();
            mla.setName(name);
            mla.setEmail(email);
            mla.setRole(role);
            mla.setPassword(encodedPassword);
            mlaRepository.save(mla);
        } else if ("USER".equalsIgnoreCase(role)) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setRole(role);
            user.setPassword(encodedPassword);
            userRepository.save(user);
        } else if ("ADMIN".equalsIgnoreCase(role)) {
            Admin admin = new Admin();
            admin.setName(name);
            admin.setEmail(email);
            admin.setRole(role);
            admin.setPassword(encodedPassword);
            adminRepository.save(admin);
        }
    }
}