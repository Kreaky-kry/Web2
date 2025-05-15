package com.luan_nguyen.example205.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.luan_nguyen.example205.entity.Cart;
import com.luan_nguyen.example205.entity.Product;
import com.luan_nguyen.example205.entity.User;
import com.luan_nguyen.example205.entity.Wishlist;

@Repository
// public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
// Optional<Wishlist> findByUserAndProduct(User user, Product product);
// boolean existsByUserAndProduct(User user, Product product);
// List<Wishlist> findByUser(User user);
// }
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Wishlist findByUser(User user);
}
