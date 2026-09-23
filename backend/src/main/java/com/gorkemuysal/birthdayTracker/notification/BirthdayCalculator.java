package com.gorkemuysal.birthdayTracker.notification;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

// A helper function to calculate how many danys left until the birthday
@Component
public class BirthdayCalculator {
    public int daysUntilNextBirthday(LocalDate birthDate){
        LocalDate today = LocalDate.now();
        LocalDate nextBirthday = birthDate.withYear(today.getYear());

        // checks if this year's birthday is passed checks next year's
        if (nextBirthday.isBefore(today)) {
            nextBirthday = nextBirthday.withYear(today.getYear() + 1);
        }

        return (int) ChronoUnit.DAYS.between(today, nextBirthday);
    }
}
