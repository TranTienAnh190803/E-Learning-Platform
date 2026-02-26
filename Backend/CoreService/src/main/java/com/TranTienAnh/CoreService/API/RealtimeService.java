package com.TranTienAnh.CoreService.API;

import com.TranTienAnh.CoreService.DTOs.Response;
import com.TranTienAnh.CoreService.Forms.ChatRoomCreateForm;
import com.TranTienAnh.CoreService.Forms.ChatRoomForm;
import com.TranTienAnh.CoreService.Forms.ChatRoomLeavingForm;
import com.TranTienAnh.CoreService.Forms.NotificationForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class RealtimeService {
    @Value("${realtime.url}")
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

    public Response<Void> createChatRoom(String token, ChatRoomCreateForm chatRoomForm) {
        return webClient.post()
                .uri(realtimeUrl + "/chat-room-api/create-chat-room")
                .headers(headers -> headers.setBearerAuth(token))
                .bodyValue(chatRoomForm)
                .exchangeToMono(response -> {
                    int statusCode = response.statusCode().value();
                    if (statusCode == 200) {
                        return response.bodyToMono(Response.class)
                                .map(body -> new Response<Void>(true, 200, " ", null));
                    }
                    else {
                        return response.bodyToMono(Response.class)
                                .map(body -> new Response<Void>(false, 400, "Cannot create chat room", null));
                    }
                })
                .block();
    }

    public Response<Void> joinChatRoom(String token, ChatRoomForm chatRoomForm) {
        return webClient.post()
                .uri(realtimeUrl + "/chat-room-api/join-chat-room")
                .headers(headers -> headers.setBearerAuth(token))
                .bodyValue(chatRoomForm)
                .exchangeToMono(response -> {
                    int statusCode = response.statusCode().value();
                    if (statusCode == 200) {
                        return response.bodyToMono(Response.class)
                                .map(body -> new Response<Void>(true, 200, " ", null));
                    }
                    else {
                        return response.bodyToMono(Response.class)
                                .map(body -> new Response<Void>(false, 400, "Cannot join chat room", null));
                    }
                })
                .block();
    }

    public Response<Void> leaveChatRoom(String token, ChatRoomLeavingForm chatRoomLeavingForm) {
        return webClient.post()
                .uri(realtimeUrl + "/chat-room-api/leave-chat-room")
                .headers(headers -> headers.setBearerAuth(token))
                .bodyValue(chatRoomLeavingForm)
                .exchangeToMono(response -> {
                    int statusCode = response.statusCode().value();
                    if (statusCode == 200) {
                        return response.bodyToMono(Response.class)
                                .map(body -> new Response<Void>(true, 200, " ", null));
                    }
                    else {
                        return response.bodyToMono(Response.class)
                                .map(body -> new Response<Void>(false, 400, "Cannot leave chat room", null));
                    }
                })
                .block();
    }

    public Response<Void> deleteChatRoom(String token, Long courseId) {
        return webClient.post()
                .uri(realtimeUrl + "/chat-room-api/delete-chat-room/" + courseId)
                .headers(headers -> headers.setBearerAuth(token))
                .exchangeToMono(response -> {
                    int statusCode = response.statusCode().value();
                    if (statusCode == 200) {
                        return response.bodyToMono(Response.class)
                                .map(body -> new Response<Void>(true, 200, " ", null));
                    }
                    else {
                        return response.bodyToMono(Response.class)
                                .map(body -> new Response<Void>(false, 400, "Cannot delete chat room", null));
                    }
                })
                .block();
    }
}
