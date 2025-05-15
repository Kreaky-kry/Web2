package com.luan_nguyen.example205;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.fluent.Form;
import org.apache.http.client.fluent.Request;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.luan_nguyen.example205.entity.GoogleAccount;

public class GoogleUtils {

    public static String getToken(String code) throws ClientProtocolException, IOException {
        String response = Request.Post(Iconstant.GOOGLE_LINK_GET_TOKEN)
                .bodyForm(
                        Form.form()
                                .add("client_id", Iconstant.GOOGLE_CLIENT_ID)
                                .add("client_secret", Iconstant.GOOGLE_CLIENT_SECRET)
                                .add("redirect_uri", Iconstant.GOOGLE_REDIRECT_URI)
                                .add("code", code)
                                .add("grant_type", Iconstant.GOOGLE_GRANT_TYPE)
                                .build())
                .execute()
                .returnContent()
                .asString();

        JsonObject json = new Gson().fromJson(response, JsonObject.class);
        return json.get("access_token").getAsString();
    }

    public static GoogleAccount getUserInfo(String accessToken) throws ClientProtocolException, IOException {
        String response = Request.Get(Iconstant.GOOGLE_LINK_GET_USER_INFO + accessToken)
                .execute()
                .returnContent()
                .asString();

        return new Gson().fromJson(response, GoogleAccount.class);
    }
}
