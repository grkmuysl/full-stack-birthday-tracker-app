package com.gorkemuysal.birthdayTracker.notification;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OutboxPoller {

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Scheduled(fixedDelay = 5000) // checks each 5 second
    @Transactional
    public void publishPendingEvents(){
        List<OutboxEvent> pending = outboxEventRepository.findByStatus(OutboxStatus.PENDING);


        for (OutboxEvent event : pending) {
            try {
                kafkaTemplate.send(event.getTopic(), event.getPayload()).get();
                event.setStatus(OutboxStatus.PUBLISHED);
                event.setPublishedAt(LocalDateTime.now());
            } catch (Exception e) {
                log.error("Outbox event couldn't send to Kafka.: id={}", event.getId(), e);
                // status still PENDING.
            }
        }
    }

}
