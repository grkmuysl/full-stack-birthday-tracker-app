package com.gorkemuysal.birthdayTracker.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

// A producer service for the sending notification of upcoming birthdays with kafka
@Service
@RequiredArgsConstructor
public class BirthdayEventProducer {

    private final KafkaTemplate<String , UpcomingBirthdayEvent> kafkaTemplate;
    private static final String TOPIC = "birthday.upcoming";

    public void publish(UpcomingBirthdayEvent event){

        // Using personId as a key for the sending message of same person to same partition
        kafkaTemplate.send(TOPIC ,event.personId().toString(), event );
    }

}
