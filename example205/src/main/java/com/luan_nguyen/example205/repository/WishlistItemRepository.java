package com.luan_nguyen.example205.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.luan_nguyen.example205.entity.Product;
import com.luan_nguyen.example205.entity.Wishlist;
import com.luan_nguyen.example205.entity.WishlistItem;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    boolean existsByWishlistAndProduct(Wishlist wishlist, Product product);

    @Query("SELECT COUNT(wi) FROM WishlistItem wi WHERE wi.wishlist.user.id = :userId")
    int countWishlistItemsByUserId(@Param("userId") Long userId);
}
