package com.luan_nguyen.example205.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.luan_nguyen.example205.model.enums.OrderStatus;
import com.luan_nguyen.example205.model.enums.PaymentMethod;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Người đặt hàng

    private BigDecimal totalPrice; // Tổng tiền đơn hàng

    @Enumerated(EnumType.STRING)
    private OrderStatus status; // Trạng thái đơn hàng

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod; // Phương thức thanh toán

    private LocalDateTime createdAt = LocalDateTime.now(); // Thời gian đặt hàng

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderItem> orderItems; // Danh sách sản phẩm trong đơn hàng

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address shippingAddress; // 🏠 Địa chỉ giao hàng
}
