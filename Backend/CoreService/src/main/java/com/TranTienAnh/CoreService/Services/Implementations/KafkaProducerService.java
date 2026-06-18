package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.Producer.KafkaProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    @Value("${kafka.topic.notification}")
    private String notificationTopic;

    @Autowired
    private KafkaProducer kafkaProducer;

    public void sendNotificationPushingEvent(String key, Object message) {
        kafkaProducer.sendMessage(notificationTopic, key, message);
    }
}
