package com.luan_nguyen.example205.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.luan_nguyen.example205.entity.Order;
import com.luan_nguyen.example205.entity.Product;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query("SELECT p FROM Product p WHERE LOWER(REPLACE(p.name, ' ', '')) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(@Param("keyword") String keyword);

    Optional<Product> findById(int Id);

    List<Product> findByBrand(String brand);

    Page<Product> findAll(Pageable pageable);

    Page<Product> findByBrand(String brand, Pageable pageable);

    Page<Product> findByCategory(String category, Pageable pageable);

    // Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable
    // pageable);
    List<Product> findAllByOrderByReleaseDateAsc();

    @Query("SELECT p FROM Product p WHERE LOWER(REPLACE(p.name, ' ', '')) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchProductsPage(@Param("keyword") String keyword, Pageable pageable);

}
