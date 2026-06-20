package com.TranTienAnh.CoreService.Configurations;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfiguration {
    @Value("${kafka.topic.notification}")
    private String notificationPushingTopic;

    @Value("${kafka.topic.chat}")
    private String chatTopic;

    // Create Topic for notification
    @Bean
    public NewTopic notificationTopic() {
        return TopicBuilder.name(notificationPushingTopic)
                .partitions(3)
                .build();
    }

    // Create Topic for Chat Room
    @Bean
    public NewTopic chatRoomTopic() {
        return TopicBuilder.name(chatTopic)
                .partitions(3)
                .build();
    }
}
