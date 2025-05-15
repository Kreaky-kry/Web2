package com.luan_nguyen.example205.payload.response;

public class LoginResponse {
    private String input; // Có thể là username hoặc email
    private String password;

    public LoginResponse(String input, String password) {
        this.input = input;
        this.password = password;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}