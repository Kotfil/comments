-- Подключение к существующей базе данных
\c dzencode;

-- Создание таблицы комментариев
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    homepage VARCHAR(255),
    avatar VARCHAR(10) DEFAULT '👤',
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    level INTEGER DEFAULT 0,
    parent_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_level ON comments(level);
CREATE INDEX idx_comments_created_at ON comments(created_at);
CREATE INDEX idx_comments_author ON comments(author);
CREATE INDEX idx_comments_homepage ON comments(homepage);

-- Создание внешнего ключа для иерархии
ALTER TABLE comments 
ADD CONSTRAINT fk_comments_parent 
FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE;

-- Создание триггера для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Вставка тестовых данных
INSERT INTO comments (author, email, homepage, content, level) VALUES
('John Doe', 'john@example.com', 'johndoe', 'Отличный пост! Очень информативно.', 0),
('Jane Smith', 'jane@example.com', 'janesmith', 'Согласна с предыдущим комментарием. Добавлю от себя: очень полезная информация!', 0),
('Bob Johnson', 'bob@example.com', NULL, 'Интересная точка зрения. Хотелось бы узнать больше деталей.', 0);

-- Создание комментария с ответами
INSERT INTO comments (author, email, content, level, parent_id) VALUES
('Alice Brown', 'alice@example.com', 'Отличный комментарий! Согласна полностью.', 1, (SELECT id FROM comments WHERE author = 'John Doe' LIMIT 1)),
('Charlie Wilson', 'charlie@example.com', 'Добавлю свои мысли по теме.', 1, (SELECT id FROM comments WHERE author = 'Jane Smith' LIMIT 1));

-- Создание ответа на ответ
INSERT INTO comments (author, email, content, level, parent_id) VALUES
('David Lee', 'david@example.com', 'Интересное обсуждение получается!', 2, (SELECT id FROM comments WHERE author = 'Alice Brown' LIMIT 1));
