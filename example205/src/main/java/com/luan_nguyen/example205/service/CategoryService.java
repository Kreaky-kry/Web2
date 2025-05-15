package com.luan_nguyen.example205.service;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.luan_nguyen.example205.entity.Brand;
import com.luan_nguyen.example205.entity.Category;
import com.luan_nguyen.example205.repository.BrandRepository;
import com.luan_nguyen.example205.repository.CategoryRepository;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@SuppressWarnings("unused")
@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoriesById(int id) {
        return categoryRepository.findById(id);
    }

    public Category createCategories(Category brand) {
        return categoryRepository.save(brand);
    }

    public Category updateCategories(Category category) {
        return categoryRepository.save(category); // Cập nhật brand
    }

    public boolean deleteCategories(int id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void importBrandsFromFile(MultipartFile file) throws IOException {
        List<Category> categories = new ArrayList<>();
        String filename = file.getOriginalFilename();

        if (filename.endsWith(".csv")) {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
                String line;
                reader.readLine(); // Bỏ qua header
                while ((line = reader.readLine()) != null) {
                    String[] data = line.split(",");
                    if (data.length > 0 && !data[0].trim().isEmpty()) {
                        Category category = new Category();
                        category.setName(data[0].trim());
                        categories.add(category);
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
                    Category category = new Category();
                    category.setName(name);
                    categories.add(category);
                }
            }
            workbook.close();
        } else {
            throw new IllegalArgumentException("Chỉ hỗ trợ file CSV hoặc Excel.");
        }

        for (Category category : categories) {
            createCategories(category);
        }
    }

    public byte[] exportBrandsToFile(String fileType) throws IOException {
        // List<Brand> brands = brandRepository.findAll();
        List<Category> categories = categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        if (fileType.equals("csv")) {
            try (PrintWriter writer = new PrintWriter(outputStream)) {
                writer.println("id,name");
                for (Category category : categories) {
                    writer.println(category.getId() + "," + escapeCsvField(category.getName()));
                }
            }
        } else if (fileType.equals("xlsx") || fileType.equals("xls")) {
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Brands");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Name");

            int rowNum = 1;
            for (Category category : categories) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(category.getId());
                row.createCell(1).setCellValue(category.getName());
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
