package com.voting.service;

import com.voting.entity.Admin;
import com.voting.entity.MLA;
import com.voting.entity.User;
import com.voting.repository.AdminRepository;
import com.voting.repository.MLARepository;
import com.voting.repository.UserRepository;
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
        // First, try to find the user in the UserRepository
        User user = userRepository.findByEmail(email);

        // If user is not found, check in MLARepository
        if (user == null) {
            MLA mla = mlaRepository.findByEmail(email);  // This now correctly uses MLA entity
            if (mla != null) {
                return new CustomUserDetails(mla.getEmail(), mla.getPassword(), getAuthorities(mla.getRole()));
            }
        }

        // If still not found, check in AdminRepository
        if (user == null) {
            Admin admin = adminRepository.findByEmail(email);  // This now correctly uses Admin entity
            if (admin != null) {
                return new CustomUserDetails(admin.getEmail(), admin.getPassword(), getAuthorities(admin.getRole()));
            }
        }

        // If none of the entities are found, throw an exception
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        // Return user if found
        return new CustomUserDetails(user.getEmail(), user.getPassword(), getAuthorities(user.getRole()));
    }


    private Collection<GrantedAuthority> getAuthorities(String role) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
        return authorities;
    }
}
