package com.luan_nguyen.example205.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@SuppressWarnings("unused")
@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order; // Liên kết đến đơn hàng

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonManagedReference // Đảm bảo dữ liệu được trả về
    private Product product; // Sản phẩm được đặt

    private int quantity; // Số lượng sản phẩm

    private BigDecimal price; // Giá tại thời điểm đặt hàng
    // ✅ Thêm getter để lấy productId trong JSON response

    public int getProductId() {
        return product != null ? product.getId() : null;
    }
}
