package com.luan_nguyen.example205.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.luan_nguyen.example205.entity.Cart;
import com.luan_nguyen.example205.entity.Wishlist;
import com.luan_nguyen.example205.payload.request.WishlistRequest;
import com.luan_nguyen.example205.service.WishlistService;

import lombok.RequiredArgsConstructor;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép Frontend truy cập API

@RequiredArgsConstructor
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/add")
    public ResponseEntity<Wishlist> addToWishlist(
            @RequestParam Long userId,
            @RequestParam int productId) {

        Wishlist wishlist = wishlistService.addToWishlist(userId, productId);
        return ResponseEntity.ok(wishlist);
        // // Chuyển đổi danh sách wishlist thành JSON
        // List<Map<String, Object>> productsList =
        // wishlist.getWishlistItems().stream().map(item -> {
        // Map<String, Object> productData = new HashMap<>();
        // productData.put("id", item.getProduct().getId());
        // productData.put("name", item.getProduct().getName());
        // productData.put("price", item.getPrice());
        // return productData;
        // }).toList();

        // // Trả về JSON theo đúng định dạng mong muốn
        // Map<String, List<Map<String, Object>>> response = new HashMap<>();
        // response.put("products", productsList);

        // return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Wishlist> getCartItems(@PathVariable Long userId) {
        Wishlist wishlist = wishlistService.getWishlistByUserId(userId);
        return ResponseEntity.ok(wishlist);
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<Integer> countWishlistItems(@PathVariable Long userId) {
        int count = wishlistService.countUserWishlistItems(userId);
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/remove")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')") // CHO PHÉP USER XÓA
    public ResponseEntity<String> removeWishlistItem(@RequestParam Long wishlistItemId) {
        wishlistService.removeWishlistItem(wishlistItemId);
        return ResponseEntity.ok("Sản phẩm đã bị xóa khỏi danh sách yêu thích");
    }

}
