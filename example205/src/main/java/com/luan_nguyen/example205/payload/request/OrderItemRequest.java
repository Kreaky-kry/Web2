package com.luan_nguyen.example205.payload.request;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OrderItemRequest {
    private int productId;
    private int quantity;
    private BigDecimal price;
}
