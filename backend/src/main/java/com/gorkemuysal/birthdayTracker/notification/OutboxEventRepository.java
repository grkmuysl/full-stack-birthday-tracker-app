package com.gorkemuysal.birthdayTracker.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OutboxEventRepository extends JpaRepository< OutboxEvent, Long> {
    List<OutboxEvent> findByStatus(OutboxStatus status);
}
