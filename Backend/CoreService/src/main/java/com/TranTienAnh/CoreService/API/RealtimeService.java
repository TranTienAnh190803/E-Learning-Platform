package com.TranTienAnh.CoreService.API;

import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Forms.NotificationForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class RealtimeService {
    @Value("realtime.service.url")
    private String realtimeUrl;

    @Autowired
    private WebClient webClient;

    public Response<Void> pushNotification(String token, NotificationForm notificationForm) {
        return webClient.post()
                .uri(realtimeUrl + "/notification-api/push-notification")
                .headers(headers -> headers.setBearerAuth(token))
                .bodyValue(notificationForm)
                .exchangeToMono(response -> {
                    int statusCode = response.statusCode().value();
                    if (statusCode == 200) {
                        return response.bodyToMono(Response.class)
                                .map(body -> new Response<Void>(true, 200, "Push notification successfully", null));
                    }
                    else {
                        return response.bodyToMono(Response.class)
                                .map(body -> new Response<Void>(false, 400, "Cannot push notification to related user", null));
                    }
                })
                .block();
    }
}
