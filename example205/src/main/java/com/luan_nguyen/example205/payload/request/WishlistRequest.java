package com.luan_nguyen.example205.payload.request;

import lombok.Data;

@Data
public class WishlistRequest {
    private Long userId;
    private Long productId;
    private int quantity;
}
