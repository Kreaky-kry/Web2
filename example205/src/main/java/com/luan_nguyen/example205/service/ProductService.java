package com.luan_nguyen.example205.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.luan_nguyen.example205.entity.Product;
import com.luan_nguyen.example205.repository.ProductRepository;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository repo;

    public List<Product> getAllProductsNoPage() {
        return repo.findAll();
    }

    public Page<Product> getAllProducts(Pageable pageable) {
        return repo.findAll(pageable);
    }

    public Product getProductById(int id) {
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageDate(imageFile.getBytes());
        return repo.save(product);
    }

    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {
        product.setImageDate(imageFile.getBytes());
        product.setImageName(imageFile.getOriginalFilename());
        product.getImageType(imageFile.getContentType());
        return repo.save(product);
    }

    public boolean updateStockQuantity(int productId, int quantityToSubtract) {
        Optional<Product> optionalProduct = repo.findById(productId);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            int currentStock = product.getStockQuantity();

            if (currentStock < quantityToSubtract) {
                return false; // Không đủ hàng
            }

            product.setStockQuantity(currentStock - quantityToSubtract);
            repo.save(product);
            return true;
        }
        return false; // Không tìm thấy sản phẩm
    }

    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    // public Page<Product> searchProducts(String keyword) {
    // return repo.findByNameContainingIgnoreCase(keyword);
    // }
    public List<Product> searchProducts(String keyword) {
        String formattedKeyword = keyword.replaceAll("\\s+", "").toLowerCase(); // Chuẩn hóa từ khóa
        return repo.searchProducts(formattedKeyword);
    }

    public Page<Product> searchProductsPage(String keyword, int page, int size) {
        String formattedKeyword = keyword.replaceAll("\\s+", "").toLowerCase(); // Chuẩn hóa từ khóa
        return repo.searchProductsPage(formattedKeyword, PageRequest.of(page, size));
    }

    // public List<Product> getProductsByBrand(String brand) {
    // return repo.findByBrand(brand);
    // }
    public Page<Product> getProductsByBrand(String brand, Pageable pageable) {
        return repo.findByBrand(brand, pageable);
    }

    public Page<Product> getProductsByCategory(String category, Pageable pageable) {
        return repo.findByCategory(category, pageable);
    }

    // public List<Product> getLatestProducts(int limit) {
    // Pageable pageable = PageRequest.of(0, limit);
    // return repo.findLatestProducts(pageable);
    // }
    public List<Product> getProductsSortedByReleaseDate() {
        return repo.findAllByOrderByReleaseDateAsc();
    }

}