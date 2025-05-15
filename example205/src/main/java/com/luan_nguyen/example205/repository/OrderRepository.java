package com.luan_nguyen.example205.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.luan_nguyen.example205.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Lấy danh sách đơn hàng theo User ID
    List<Order> findByUserId(Long userId);

    // Lấy danh sách đơn hàng theo trạng thái
    List<Order> findByStatus(String status);

}
