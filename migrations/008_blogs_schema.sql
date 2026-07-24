CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(255) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    featured_image VARCHAR(1000),
    meta_description TEXT,
    published_date DATE NOT NULL,
    reading_time VARCHAR(50),
    author VARCHAR(255),
    tags JSONB DEFAULT '[]'::jsonb,
    related_articles JSONB DEFAULT '[]'::jsonb,
    toc JSONB DEFAULT '[]'::jsonb,
    content TEXT,
    faq JSONB DEFAULT '[]'::jsonb,
    category VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
