package com.luan_nguyen.example205.payload.request;

import lombok.Data;

@Data
public class AddressRequest {
    private String province;
    private String district;
    private String ward;
    private String street;
}
