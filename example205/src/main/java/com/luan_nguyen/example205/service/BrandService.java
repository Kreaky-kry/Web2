package com.luan_nguyen.example205.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.luan_nguyen.example205.entity.Brand;
import com.luan_nguyen.example205.repository.BrandRepository;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Workbook; // class bị thiếu
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;

import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Service
public class BrandService {
    @Autowired
    private BrandRepository brandRepository;

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Optional<Brand> getBrandById(int id) {
        return brandRepository.findById(id);
    }

    public Brand createBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    public Brand updateBrand(Brand brand) {
        return brandRepository.save(brand); // Cập nhật brand
    }

    public boolean deleteBrand(int id) {
        if (brandRepository.existsById(id)) {
            brandRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void importBrandsFromFile(MultipartFile file) throws IOException {
        List<Brand> brands = new ArrayList<>();
        String filename = file.getOriginalFilename();

        if (filename.endsWith(".csv")) {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
                String line;
                reader.readLine(); // Bỏ qua header
                while ((line = reader.readLine()) != null) {
                    String[] data = line.split(",");
                    if (data.length > 0 && !data[0].trim().isEmpty()) {
                        Brand brand = new Brand();
                        brand.setName(data[0].trim());
                        brands.add(brand);
                    }
                }
            }
        } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
            Workbook workbook = WorkbookFactory.create(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();
            if (rowIterator.hasNext()) {
                rowIterator.next(); // Bỏ header
            }
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                String name = getStringCellValue(row.getCell(0)).trim();
                if (!name.isEmpty()) {
                    Brand brand = new Brand();
                    brand.setName(name);
                    brands.add(brand);
                }
            }
            workbook.close();
        } else {
            throw new IllegalArgumentException("Chỉ hỗ trợ file CSV hoặc Excel.");
        }

        for (Brand brand : brands) {
            createBrand(brand);
        }
    }

    public byte[] exportBrandsToFile(String fileType) throws IOException {
        // List<Brand> brands = brandRepository.findAll();
        List<Brand> brands = brandRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        if (fileType.equals("csv")) {
            try (PrintWriter writer = new PrintWriter(outputStream)) {
                writer.println("id,name");
                for (Brand brand : brands) {
                    writer.println(brand.getId() + "," + escapeCsvField(brand.getName()));
                }
            }
        } else if (fileType.equals("xlsx") || fileType.equals("xls")) {
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Brands");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Name");

            int rowNum = 1;
            for (Brand brand : brands) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(brand.getId());
                row.createCell(1).setCellValue(brand.getName());
            }

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);
            workbook.write(outputStream);
            workbook.close();
        } else {
            throw new IllegalArgumentException("Chỉ hỗ trợ file CSV hoặc Excel.");
        }

        return outputStream.toByteArray();
    }

    private String getStringCellValue(Cell cell) {
        if (cell == null)
            return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf(cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    private String escapeCsvField(String field) {
        if (field == null)
            return "";
        if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        return field;
    }
}
