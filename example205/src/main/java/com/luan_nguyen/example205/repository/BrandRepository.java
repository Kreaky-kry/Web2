package com.luan_nguyen.example205.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.luan_nguyen.example205.entity.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
}
