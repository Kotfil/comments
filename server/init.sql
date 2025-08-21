-- Создание базы данных (если не существует)
-- CREATE DATABASE comments_db;

-- Подключение к базе данных
\c comments_db;

-- Создание расширения для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание таблицы комментариев
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    homepage VARCHAR(255),
    avatar VARCHAR(10) DEFAULT '👤',
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    level INTEGER DEFAULT 0,
    parent_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ограничения
    CONSTRAINT fk_parent_comment 
        FOREIGN KEY (parent_id) 
        REFERENCES comments(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT check_content_length 
        CHECK (char_length(content) >= 10),
    
    CONSTRAINT check_author_length 
        CHECK (char_length(author) >= 2),
    
    CONSTRAINT check_email_format 
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_homepage ON comments(homepage);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_level ON comments(level);

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
INSERT INTO comments (author, email, homepage, content, avatar, level) VALUES
('John Doe', 'john@example.com', 'johndoe', 'Отличный пост! Очень информативно и полезно для разработчиков.', '👨‍💻', 0),
('Jane Smith', 'jane@example.com', 'janesmith', 'Согласна с предыдущим комментарием. Добавлю от себя: очень полезная информация для начинающих!', '👩‍🎨', 0),
('Bob Johnson', 'bob@example.com', NULL, 'Интересная точка зрения. Хотелось бы узнать больше деталей о реализации.', '👨‍🔬', 0)
ON CONFLICT DO NOTHING;

-- Создание представления для основных комментариев
CREATE OR REPLACE VIEW main_comments AS
SELECT 
    c.*,
    COUNT(r.id) as replies_count
FROM comments c
LEFT JOIN comments r ON c.id = r.parent_id
WHERE c.parent_id IS NULL
GROUP BY c.id
ORDER BY c.created_at DESC;

-- Создание представления для комментариев с ответами
CREATE OR REPLACE VIEW comments_with_replies AS
SELECT 
    c.*,
    r.id as reply_id,
    r.author as reply_author,
    r.content as reply_content,
    r.created_at as reply_created_at
FROM comments c
LEFT JOIN comments r ON c.id = r.parent_id
WHERE c.parent_id IS NULL
ORDER BY c.created_at DESC, r.created_at ASC;

-- Функция для получения комментарий по homepage
CREATE OR REPLACE FUNCTION get_comment_by_homepage(p_homepage VARCHAR)
RETURNS TABLE (
    id UUID,
    author VARCHAR,
    email VARCHAR,
    homepage VARCHAR,
    avatar VARCHAR,
    content TEXT,
    timestamp TIMESTAMP,
    likes INTEGER,
    dislikes INTEGER,
    level INTEGER,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.author,
        c.email,
        c.homepage,
        c.avatar,
        c.content,
        c.timestamp,
        c.likes,
        c.dislikes,
        c.level,
        c.created_at
    FROM comments c
    WHERE c.homepage = p_homepage;
END;
$$ LANGUAGE plpgsql;

-- Функция для получения всех комментариев с иерархией
CREATE OR REPLACE FUNCTION get_comments_hierarchy()
RETURNS TABLE (
    id UUID,
    author VARCHAR,
    content TEXT,
    level INTEGER,
    parent_id UUID,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE comment_tree AS (
        -- Основные комментарии
        SELECT 
            c.id,
            c.author,
            c.content,
            c.level,
            c.parent_id,
            c.created_at,
            0 as depth
        FROM comments c
        WHERE c.parent_id IS NULL
        
        UNION ALL
        
        -- Ответы
        SELECT 
            r.id,
            r.author,
            r.content,
            r.level,
            r.parent_id,
            r.created_at,
            ct.depth + 1
        FROM comments r
        INNER JOIN comment_tree ct ON r.parent_id = ct.id
        WHERE ct.depth < 3 -- Ограничиваем глубину вложенности
    )
    SELECT 
        ct.id,
        ct.author,
        ct.content,
        ct.level,
        ct.parent_id,
        ct.created_at
    FROM comment_tree ct
    ORDER BY ct.created_at DESC, ct.depth ASC;
END;
$$ LANGUAGE plpgsql;

-- Создание пользователя для приложения (опционально)
-- CREATE USER comments_app WITH PASSWORD 'app_password';
-- GRANT CONNECT ON DATABASE comments_db TO comments_app;
-- GRANT USAGE ON SCHEMA public TO comments_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO comments_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO comments_app;

-- Вывод информации о созданных объектах
SELECT 'Database initialized successfully!' as status;
