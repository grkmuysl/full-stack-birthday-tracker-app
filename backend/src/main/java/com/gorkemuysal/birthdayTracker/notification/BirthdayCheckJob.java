package com.gorkemuysal.birthdayTracker.notification;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gorkemuysal.birthdayTracker.contact.Person;
import com.gorkemuysal.birthdayTracker.contact.PersonRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

// A Job to checks Upcoming Birthdays
@Component
@RequiredArgsConstructor
public class BirthdayCheckJob {

    private static final int THRESHOLD_DAYS = 7;

    private final PersonRepository personRepository;
    private final BirthdayCalculator birthdayCalculator;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void checkUpcomingBirthdays() {
        List<Person> allPeople = personRepository.findAll();

        allPeople.stream()
                .map(p -> Map.entry(p, birthdayCalculator.daysUntilNextBirthday(p.getBirthDate())))
                .filter(entry -> entry.getValue() <= THRESHOLD_DAYS)
                .forEach(entry -> saveToOutbox(entry.getKey(), entry.getValue()));
    }

    private void saveToOutbox(Person p, int daysUntil) {
        try {
            var event = new UpcomingBirthdayEvent(p.getId(), p.getFullName(), p.getBirthDate(), daysUntil);
            OutboxEvent outboxEvent = new OutboxEvent();
            outboxEvent.setTopic("birthday.upcoming");
            outboxEvent.setPayload(objectMapper.writeValueAsString(event));
            outboxEventRepository.save(outboxEvent);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Event didn't serialized", e);
        }
    }
}
