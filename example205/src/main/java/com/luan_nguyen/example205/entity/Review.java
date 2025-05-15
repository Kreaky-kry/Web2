package com.luan_nguyen.example205.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Liên kết với User

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // Nội dung đánh giá

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private LocalDateTime createdAt = LocalDateTime.now(); // Thời gian đặt hàng
    // Gán thời gian tự động khi tạo mới review

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
