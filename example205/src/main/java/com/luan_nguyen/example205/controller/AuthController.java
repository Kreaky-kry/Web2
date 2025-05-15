package com.luan_nguyen.example205.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.luan_nguyen.example205.entity.Product;
import com.luan_nguyen.example205.dto.LoginDto;
import com.luan_nguyen.example205.entity.User;
import com.luan_nguyen.example205.model.ERole;
import com.luan_nguyen.example205.model.Role;
import com.luan_nguyen.example205.payload.request.EmailRequest;
import com.luan_nguyen.example205.payload.request.LoginRequest;
import com.luan_nguyen.example205.payload.request.OtpRequest;
import com.luan_nguyen.example205.payload.request.ResetPasswordRequest;
import com.luan_nguyen.example205.payload.request.SignupRequest;
import com.luan_nguyen.example205.payload.response.JwtResponse;
import com.luan_nguyen.example205.payload.response.LoginResponse;
import com.luan_nguyen.example205.payload.response.MessageResponse;
import com.luan_nguyen.example205.repository.RoleRepository;
import com.luan_nguyen.example205.repository.UserRepository;
import com.luan_nguyen.example205.security.jwt.JwtUtils;
import com.luan_nguyen.example205.security.services.UserDetailsImpl;
import com.luan_nguyen.example205.service.EmailService;
import com.luan_nguyen.example205.service.OtpService;
import com.luan_nguyen.example205.service.UserService;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailService emailService;

    @Autowired
    OtpService otpService;

    @Autowired
    UserService userService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("login")
    public ResponseEntity<String> login(@RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String response = "You have successfully logged in!";
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user-info")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')") // Chỉ cho phép USER và ADMIN truy cập
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String token) {
        try {
            // Bỏ chữ "Bearer " khỏi token trước khi xử lý
            String jwt = token.replace("Bearer ", "");

            // Giải mã token để lấy username
            String email = jwtUtils.getEmailFromJwtToken(jwt);

            // Tìm thông tin người dùng trong DB
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOptional.get();
            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')") // Chỉ ADMIN được phép truy cập
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll(); // Lấy toàn bộ user từ DB

        List<Map<String, Object>> userList = users.stream().map(user -> {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("password", user.getPassword());

            userData.put("roles", user.getRoles().stream()
                    .map(role -> role.getName().name()) // Lấy danh sách role của user
                    .collect(Collectors.toList()));
            return userData;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(userList); // Trả về danh sách user
    }

    // 🟢 API CẬP NHẬT USER (Chỉ ADMIN)
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password) {

        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOptional.get();

        // Cập nhật username nếu có
        if (username != null && !username.isEmpty()) {
            user.setUsername(username);
        }

        // Cập nhật email nếu có
        if (email != null && !email.isEmpty()) {
            user.setEmail(email);
        }

        // Cập nhật password nếu có
        if (password != null && !password.isEmpty()) {
            user.setPassword(encoder.encode(password)); // Mã hóa mật khẩu trước khi lưu
        }

        userRepository.save(user); // Lưu thay đổi vào DB
        return ResponseEntity.ok("User updated successfully");
    }

    // 🔴 API XÓA USER (Chỉ ADMIN)
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getOneUser(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        User user = userOptional.get();
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("password", user.getPassword());
        userData.put("roles", user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList()));
        return ResponseEntity.ok(userData);
    }

    //
    // @PostMapping("/request-otp")
    // public ResponseEntity<?> requestOtp(@RequestBody EmailRequest request) {
    // String otp = otpService.generateOtp(request.getEmail());
    // emailService.sendOtp(request.getEmail(), otp);
    // return ResponseEntity.ok("OTP đã được gửi về email của bạn.");
    // }

    // @PostMapping("/verify-otp")
    // public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
    // boolean isValidOtp = otpService.validateOtp(request.getEmail(),
    // request.getOtp());
    // if (isValidOtp) {
    // return ResponseEntity.ok("Mã OTP hợp lệ.");
    // } else {
    // return ResponseEntity.badRequest().body("Mã OTP không hợp lệ hoặc đã hết
    // hạn.");
    // }
    // }

    // //
    // @PostMapping("/reset-password")
    // public ResponseEntity<?> resetPassword(@Valid @RequestBody
    // ResetPasswordRequest resetPasswordRequest) {
    // // Kiểm tra xem email có tồn tại không
    // User user = userRepository.findByEmail(resetPasswordRequest.getEmail())
    // .orElseThrow(() -> new RuntimeException("Error: User not found."));

    // // Kiểm tra mã OTP
    // boolean isValidOtp = otpService.validateOtp(resetPasswordRequest.getEmail(),
    // resetPasswordRequest.getOtp());
    // if (!isValidOtp) {
    // return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid
    // or expired OTP."));
    // }

    // // Cập nhật mật khẩu
    // user.setPassword(encoder.encode(resetPasswordRequest.getNewPassword()));
    // userRepository.save(user);

    // return ResponseEntity.ok(new MessageResponse("Password reset
    // successfully!"));
    // }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        userService.sendPasswordResetCode(email);
        return ResponseEntity.ok(Map.of("message", "Mã xác thực đã được gửi tới email."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword) {
        userService.resetPassword(email, otp, newPassword);
        return ResponseEntity.ok(Map.of("message", "Đặt lại mật khẩu thành công."));
    }
}