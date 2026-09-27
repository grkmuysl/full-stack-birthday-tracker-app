CREATE TABLE outbox_events(
    id BIGSERIAL PRIMARY KEY ,
    topic VARCHAR(255) NOT NULL ,
    payload TEXT NOT NULL ,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    published_at TIMESTAMP
);