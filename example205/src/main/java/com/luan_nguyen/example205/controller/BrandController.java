package com.luan_nguyen.example205.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.luan_nguyen.example205.entity.Brand;
import com.luan_nguyen.example205.service.BrandService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép Frontend truy cập API
public class BrandController {
    @Autowired
    private BrandService brandService;

    // Lấy tất cả brands
    @GetMapping
    public ResponseEntity<List<Brand>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }

    // Lấy brand theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable int id) {
        Optional<Brand> brand = brandService.getBrandById(id);
        return brand.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Thêm mới brand
    @PostMapping
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
        Brand savedBrand = brandService.createBrand(brand);
        return ResponseEntity.ok(savedBrand);
    }

    // Cập nhật brand theo ID
    @PutMapping("/{id}")
    public ResponseEntity<Brand> updateBrand(@PathVariable int id, @RequestBody Brand brand) {
        Optional<Brand> existingBrand = brandService.getBrandById(id);
        if (existingBrand.isPresent()) {
            brand.setId(id); // Đảm bảo ID không bị thay đổi
            return ResponseEntity.ok(brandService.updateBrand(brand));
        }
        return ResponseEntity.notFound().build();
    }

    // Xóa brand theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable int id) {
        if (brandService.deleteBrand(id)) {
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
            brandService.importBrandsFromFile(file);
            return ResponseEntity.ok("Import thương hiệu thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Import thất bại: " + e.getMessage());
        }
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportBrands(@RequestParam("type") String fileType) {
        try {
            byte[] fileContent = brandService.exportBrandsToFile(fileType);
            String filename = "brands." + fileType;
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
