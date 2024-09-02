package com.voting.service.security;

import com.voting.entity.security.Admin;
import com.voting.entity.security.MLA;
import com.voting.entity.security.User;
import com.voting.repository.security_repo.AdminRepository;
import com.voting.repository.security_repo.MLARepository;
import com.voting.repository.security_repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MLARepository mlaRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails userDetails = findUserByEmail(email);
        if (userDetails == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return userDetails;
    }

    private UserDetails findUserByEmail(String email) {
        // Try to find user in UserRepository
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return new CustomUserDetails(user.getEmail(), user.getPassword(), getAuthorities(user.getRole()));
        }

        // If not found, check in MLARepository
        MLA mla = mlaRepository.findByEmail(email);
        if (mla != null) {
            return new CustomUserDetails(mla.getEmail(), mla.getPassword(), getAuthorities(mla.getRole()));
        }

        // If still not found, check in AdminRepository
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null) {
            return new CustomUserDetails(admin.getEmail(), admin.getPassword(), getAuthorities(admin.getRole()));
        }

        return null;
    }

    private Collection<GrantedAuthority> getAuthorities(String role) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
        return authorities;
    }
}
