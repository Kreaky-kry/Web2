package com.luan_nguyen.example205.payload.request;

import java.math.BigDecimal;
import java.util.List;

import com.luan_nguyen.example205.model.enums.OrderStatus;
import com.luan_nguyen.example205.model.enums.PaymentMethod;

import lombok.Data;

@Data
public class OrderRequest {
    private Long userId;
    private BigDecimal totalPrice;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private List<OrderItemRequest> orderItems;
    private AddressRequest address;
}
