package com.TranTienAnh.CoreService.Services.Implementations;

import com.TranTienAnh.CoreService.Forms.Events;
import com.TranTienAnh.CoreService.Producer.KafkaProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    @Autowired
    private KafkaProducer kafkaProducer;

    public void sendMessage(String topic, String key, Events<?> message) {
        kafkaProducer.sendMessage(topic, key, message);
    }
}
