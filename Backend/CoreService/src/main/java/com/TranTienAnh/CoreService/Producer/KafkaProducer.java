package com.TranTienAnh.CoreService.Producer;

import com.TranTienAnh.CoreService.Forms.Events;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class KafkaProducer {
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public void sendMessage(String topicName, String key, Events<?> event) {
        String message = objectMapper.writeValueAsString(event);
        kafkaTemplate.send(topicName, key, message);
    }
}
