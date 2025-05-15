package com.luan_nguyen.example205.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.luan_nguyen.example205.entity.Category;
import com.luan_nguyen.example205.service.CategoryService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*") // Cho phép gọi API từ frontend
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoriesById(@PathVariable int id) {
        Optional<Category> category = categoryService.getCategoriesById(id);
        return category.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Category> createCategories(@RequestBody Category category) {
        Category savedBrand = categoryService.createCategories(category);
        return ResponseEntity.ok(savedBrand);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategories(@PathVariable int id, @RequestBody Category category) {
        Optional<Category> existingCategory = categoryService.getCategoriesById(id);
        if (existingCategory.isPresent()) {
            category.setId(id); // Đảm bảo ID không bị thay đổi
            return ResponseEntity.ok(categoryService.updateCategories(category));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategories(@PathVariable int id) {
        if (categoryService.deleteCategories(id)) {
            return ResponseEntity.noContent().build(); // Trả về 204 khi xóa thành công
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/import")
    public ResponseEntity<String> importBrands(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng chọn file để upload.");
            }
            categoryService.importBrandsFromFile(file);
            return ResponseEntity.ok("Import category thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Import thất bại: " + e.getMessage());
        }
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportBrands(@RequestParam("type") String fileType) {
        try {
            byte[] fileContent = categoryService.exportBrandsToFile(fileType);
            String filename = "categories." + fileType;
            String contentType = fileType.equals("csv") ? "text/csv"
                    : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(fileContent);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(("Export thất bại: " + e.getMessage()).getBytes());
        }
    }
}
