package com.luan_nguyen.example205.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.luan_nguyen.example205.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Lấy danh sách OrderItem theo Order ID
    List<OrderItem> findByOrderId(Long orderId);
}