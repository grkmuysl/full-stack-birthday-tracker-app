CREATE TABLE persons (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name         VARCHAR(150) NOT NULL,
    birth_date        DATE         NOT NULL,
    birth_year_known  BOOLEAN      NOT NULL DEFAULT FALSE,
    note              TEXT,
    photo_url         VARCHAR(500),
    category_id       BIGINT,
    owner_id          BIGINT       NOT NULL,
    created_at        TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at        TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT fk_persons_category
        FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE SET NULL,

    CONSTRAINT fk_persons_owner
        FOREIGN KEY (owner_id) REFERENCES users (id)
        ON DELETE CASCADE
);

CREATE INDEX idx_persons_owner_id ON persons (owner_id);
CREATE INDEX idx_persons_category_id ON persons (category_id);
CREATE INDEX idx_persons_birth_date ON persons (birth_date);