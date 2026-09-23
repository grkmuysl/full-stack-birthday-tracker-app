package com.gorkemuysal.birthdayTracker.notification;

import com.gorkemuysal.birthdayTracker.contact.Person;
import com.gorkemuysal.birthdayTracker.contact.PersonRepository;
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
    private final BirthdayEventProducer producer;

    @Scheduled(cron = "0 0 9 * * *") // each day at the 09:00
    public void checkUpcomingBirthdays(){

        // Checks all person in the list
        List<Person> allPeople = personRepository.findAll();
        allPeople.stream()
                .map(p -> Map.entry(p, birthdayCalculator.daysUntilNextBirthday(p.getBirthDate())))
                .filter(entry -> entry.getValue() <= THRESHOLD_DAYS)
                .forEach(entry -> {
                    Person p = entry.getKey();
                    int daysUntil = entry.getValue();
                    producer.publish(new UpcomingBirthdayEvent(
                            p.getId(), p.getFullName(), p.getBirthDate(), daysUntil
                    ));
                });
    }
}
