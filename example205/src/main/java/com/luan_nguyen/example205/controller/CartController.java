package com.luan_nguyen.example205.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.luan_nguyen.example205.entity.Cart;
import com.luan_nguyen.example205.service.CartService;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép Frontend truy cập API
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestParam Long userId,
            @RequestParam int productId,
            @RequestParam(defaultValue = "1") int quantity) {

        Cart updatedCart = cartService.addToCart(userId, productId, quantity); // Gọi đúng tên phương thức
        return ResponseEntity.ok(updatedCart);
    }

    // API lấy danh sách sản phẩm trong giỏ hàng theo userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<Cart> getCartItems(@PathVariable Long userId) {
        Cart cart = cartService.getCartItemsByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> countCartItems(@RequestParam Long userId) {
        int totalItems = cartService.getTotalItemsInCart(userId);
        return ResponseEntity.ok(totalItems);
    }

    @PutMapping("/update-quantity")
    public ResponseEntity<String> updateQuantity(
            @RequestParam Long cartItemId,
            @RequestParam int quantity) {
        cartService.updateCartItemQuantity(cartItemId, quantity);
        return ResponseEntity.ok("Cập nhật số lượng thành công!");
    }

    @DeleteMapping("/remove")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')") // CHO PHÉP USER XÓA
    public ResponseEntity<String> removeCartItem(@RequestParam Long cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ResponseEntity.ok("Sản phẩm đã bị xóa");
    }

}
