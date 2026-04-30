-- Oden's Journal Database Schema
-- Engine: MySQL (compatible with SQLite structure where applicable)

-- =====================================================
-- TABLE: entries
-- stores main journal content
-- =====================================================

CREATE TABLE IF NOT EXISTS entries (
    id VARCHAR(64) PRIMARY KEY,
    content TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

-- =====================================================
-- TABLE: tags
-- unique tags for categorizing entries
-- =====================================================

CREATE TABLE IF NOT EXISTS tags (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) UNIQUE
);

-- =====================================================
-- TABLE: entry_tags
-- junction table for many-to-many relationship
-- =====================================================

CREATE TABLE IF NOT EXISTS entry_tags (
    entry_id VARCHAR(64),
    tag_id VARCHAR(64),
    PRIMARY KEY (entry_id, tag_id),

    CONSTRAINT fk_entry
        FOREIGN KEY (entry_id)
        REFERENCES entries(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tag
        FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);

-- =====================================================
-- FULL-TEXT SEARCH (MySQL equivalent of SQLite FTS5)
-- =====================================================

-- MySQL full-text index on content
ALTER TABLE entries
ADD FULLTEXT INDEX idx_entries_content (content);

-- =====================================================
-- OPTIONAL: INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_entries_created_at ON entries(created_at);
CREATE INDEX idx_entries_updated_at ON entries(updated_at);
CREATE INDEX idx_tags_name ON tags(name);
