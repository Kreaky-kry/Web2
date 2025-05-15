package com.luan_nguyen.example205.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.luan_nguyen.example205.entity.User;
import com.luan_nguyen.example205.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    // @Override
    // @Transactional
    // public UserDetails loadUserByUsername(String email) throws
    // UsernameNotFoundException {
    // User user = userRepository.findByEmail(email)
    // .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email:"
    // + email));
    // return UserDetailsImpl.build(user);
    // }
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String input) throws UsernameNotFoundException {
        System.out.println("🔍 Đang tìm user với input: " + input);

        User user = userRepository.findByUsernameOrEmail(input, input)
                .orElseThrow(() -> new UsernameNotFoundException("❌ Không tìm thấy user với:" + input));

        return UserDetailsImpl.build(user);
    }

}
