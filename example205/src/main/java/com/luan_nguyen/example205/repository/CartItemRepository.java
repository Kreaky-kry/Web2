package com.luan_nguyen.example205.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.luan_nguyen.example205.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    @Query("SELECT SUM(ci.quantity) FROM CartItem ci WHERE ci.cart.user.id = :userId")
    Integer countTotalItemsInCart(@Param("userId") Long userId);
}
