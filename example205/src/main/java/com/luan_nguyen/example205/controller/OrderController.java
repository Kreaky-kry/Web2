package com.luan_nguyen.example205.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.luan_nguyen.example205.entity.Order;
import com.luan_nguyen.example205.entity.OrderItem;
import com.luan_nguyen.example205.model.enums.OrderStatus;
import com.luan_nguyen.example205.payload.request.OrderRequest;
import com.luan_nguyen.example205.service.OrderService;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép Frontend truy cập API

public class OrderController {
    @Autowired
    private OrderService orderService;

    // 📌 Lấy danh sách tất cả đơn hàng
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // 📌 Lấy đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    // 📌 Lấy đơn hàng theo userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // 📌 Tạo đơn hàng mới
    @PostMapping("/add")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest) {
        Order newOrder = orderService.createOrder(orderRequest);
        return ResponseEntity.ok(newOrder);
    }

    // 📌 Cập nhật trạng thái đơn hàng
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }

    // 📌 Xóa đơn hàng
    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok("Đơn hàng đã bị xóa!");
    }

    // 📌 Thêm sản phẩm vào đơn hàng
    @PostMapping("/{orderId}/items")
    public ResponseEntity<OrderItem> addOrderItem(@PathVariable Long orderId, @RequestBody OrderItem orderItem) {
        OrderItem newItem = orderService.addOrderItem(orderItem);
        return ResponseEntity.ok(newItem);
    }

    // 📌 Xóa sản phẩm khỏi đơn hàng
    @DeleteMapping("/items/{orderItemId}")
    public ResponseEntity<String> removeOrderItem(@PathVariable Long orderItemId) {
        orderService.removeOrderItem(orderItemId);
        return ResponseEntity.ok("Sản phẩm đã bị xóa khỏi đơn hàng!");
    }
}