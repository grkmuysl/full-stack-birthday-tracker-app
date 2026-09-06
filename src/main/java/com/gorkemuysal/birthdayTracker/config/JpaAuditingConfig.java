package com.gorkemuysal.birthdayTracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * A config file to handle Jpa Auditing Configuratins
 * Thanks to @EnableJpaAuditing annotation Spring can listens CreatedDate and LastModifiedDate annotatiios
 * */

@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {

}
