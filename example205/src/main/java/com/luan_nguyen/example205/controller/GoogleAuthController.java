package com.luan_nguyen.example205.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.luan_nguyen.example205.GoogleUtils;
import com.luan_nguyen.example205.entity.GoogleAccount;
import com.luan_nguyen.example205.entity.User;
import com.luan_nguyen.example205.model.ERole;
import com.luan_nguyen.example205.model.Role;
import com.luan_nguyen.example205.payload.response.JwtResponse;
import com.luan_nguyen.example205.repository.RoleRepository;
import com.luan_nguyen.example205.repository.UserRepository;
import com.luan_nguyen.example205.security.jwt.JwtUtils;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@SuppressWarnings("unused")
@Controller
@RequestMapping("/api/google")
@CrossOrigin(origins = "http://localhost:3000")
public class GoogleAuthController {

    @Autowired
    private JwtUtils jwtUtils; // Utility để tạo JWT token

    @Autowired
    private RoleRepository roleRepository; // Cần repository để lấy role

    @Autowired
    private UserRepository userrpo;

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Value("${google.redirect.uri}")
    private String redirectUri;
    @Autowired
    private UserRepository userRepository; // Đảm bảo rằng bạn đã inject UserRepository

    // @GetMapping("/google-login")
    // public ResponseEntity<?> googleLogin(@RequestParam("code") String code) {
    // try {
    // // Lấy access token từ Google
    // String accessToken = GoogleUtils.getToken(code);

    // // Lấy thông tin người dùng từ Google
    // GoogleAccount googleUser = GoogleUtils.getUserInfo(accessToken);

    // // Kiểm tra người dùng đã tồn tại chưa
    // User user = userRepository.findByEmail(googleUser.getEmail()).orElse(null);

    // if (user == null) {
    // // Nếu chưa có thì tạo mới
    // user = new User(googleUser.getGivenName(), googleUser.getEmail(), "google");

    // Role userRole = roleRepository.findByName(ERole.ROLE_USER)
    // .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

    // Set<Role> roles = new HashSet<>();
    // roles.add(userRole);

    // user.setRoles(roles);
    // user.setProvider("google");
    // user.setRole("user");

    // userRepository.save(user);
    // }

    // // Tạo JWT token
    // String jwt = jwtUtils.generateJwtTokenFromEmail(user.getEmail());

    // List<String> roles = user.getRoles().stream()
    // .map(role -> role.getName().name()) // assuming ERole enum
    // .collect(Collectors.toList());

    // // Trả về JSON như login truyền thống
    // return ResponseEntity.ok(new JwtResponse(
    // jwt,
    // user.getId(),
    // user.getUsername(),
    // user.getEmail(),
    // roles));

    // } catch (Exception e) {
    // e.printStackTrace();
    // System.err.println("Lỗi cụ thể: " + e.getMessage());

    // return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
    // .body("Google login failed");
    // }
    // }
    @GetMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestParam("code") String code) {
        try {
            // Lấy access token từ Google
            String accessToken = GoogleUtils.getToken(code);

            // Lấy thông tin người dùng từ Google
            GoogleAccount googleUser = GoogleUtils.getUserInfo(accessToken);

            // Kiểm tra người dùng đã tồn tại
            User user = userRepository.findByEmail(googleUser.getEmail()).orElse(null);

            if (user == null) {
                // Nếu chưa có, tạo mới
                user = new User(googleUser.getGivenName(), googleUser.getEmail(), "google");

                Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role not found"));

                Set<Role> roles = new HashSet<>();
                roles.add(userRole);

                user.setRoles(roles);
                user.setProvider("google");
                user.setRole("user");

                userRepository.save(user);
            }

            // Tạo JWT token
            String jwt = jwtUtils.generateJwtTokenFromEmail(user.getEmail());

            List<String> roles = user.getRoles().stream()
                    .map(role -> role.getName().name()) // assuming ERole enum
                    .collect(Collectors.toList());

            // Trả về token trong JSON
            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    roles));

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Lỗi cụ thể: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Google login failed");
        }
    }

}
