package com.luan_nguyen.example205.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.luan_nguyen.example205.entity.Cart;
import com.luan_nguyen.example205.entity.CartItem;
import com.luan_nguyen.example205.entity.Product;
import com.luan_nguyen.example205.entity.User;
import com.luan_nguyen.example205.entity.Wishlist;
import com.luan_nguyen.example205.entity.WishlistItem;
import com.luan_nguyen.example205.repository.ProductRepository;
import com.luan_nguyen.example205.repository.UserRepository;
import com.luan_nguyen.example205.repository.WishlistItemRepository;
import com.luan_nguyen.example205.repository.WishlistRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@SuppressWarnings("unused")
@Service
@RequiredArgsConstructor
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;
    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Wishlist addToWishlist(Long userId, int productId) {
        // Tìm user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        // Tìm wishlist của user
        Wishlist wishlist = wishlistRepository.findByUser(user);
        if (wishlist == null) {
            wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setWishlistItems(new ArrayList<>());
        }

        // Tìm sản phẩm
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));

        // // Kiểm tra xem sản phẩm đã có trong wishlist chưa
        // boolean exists = wishlistItemRepository.existsByWishlistAndProduct(wishlist,
        // product);
        // if (exists) {
        // throw new RuntimeException("Sản phẩm đã có trong danh sách yêu thích!");
        // }

        // // Thêm sản phẩm mới vào wishlist
        // WishlistItem wishlistItem = new WishlistItem();
        // wishlistItem.setWishlist(wishlist);
        // wishlistItem.setProduct(product);
        // wishlistItem.setPrice(product.getPrice());

        // wishlist.getWishlistItems().add(wishlistItem);
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        WishlistItem existingItem = wishlist.getWishlistItems().stream()
                .filter(item -> item.getProduct().getId() == productId)
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Nếu sản phẩm đã có, cập nhật số lượng và tổng giá của CartItem
            throw new RuntimeException("Sản phẩm đã có trong danh sách yêu thích!");

        } else {
            // Nếu sản phẩm chưa có, tạo mới CartItem
            WishlistItem wishlistItem = new WishlistItem();
            wishlistItem.setWishlist(wishlist);
            wishlistItem.setProduct(product);
            wishlistItem.setPrice(product.getPrice());
            wishlist.getWishlistItems().add(wishlistItem);
        }

        wishlistRepository.save(wishlist);

        return wishlist;
    }

    public Wishlist getWishlistByUserId(Long userId) {
        // Tìm user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        // Lấy danh sách wishlist của user
        Wishlist wishlist = wishlistRepository.findByUser(user);

        if (wishlist == null || wishlist.getWishlistItems().isEmpty()) {
            throw new RuntimeException("Người dùng chưa có sản phẩm yêu thích");
        }

        return wishlist;
    }

    public int countUserWishlistItems(Long userId) {
        // Kiểm tra user có tồn tại không
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Không tìm thấy người dùng!");
        }
        return wishlistItemRepository.countWishlistItemsByUserId(userId);
    }

    public void removeWishlistItem(Long wishlistItemId) {
        // Tìm WishlistItem theo ID
        WishlistItem wishlistItem = wishlistItemRepository.findById(wishlistItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong danh sách yêu thích!"));

        // Xóa WishlistItem khỏi database
        wishlistItemRepository.delete(wishlistItem);
    }
}
