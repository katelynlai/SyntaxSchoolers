-- Users table
CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'Student' CHECK (role IN ('Student', 'staff')),
    PRIMARY KEY (user_id)
    );

-- Category table
CREATE TABLE category (
    category_id INT GENERATED ALWAYS AS IDENTITY,
    category_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (category_id)
    );

-- Vocab table
CREATE TABLE vocab (
    vocab_id INT GENERATED ALWAYS AS IDENTITY,
    lang1_word VARCHAR(255) NOT NULL,
    lang2_word VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (vocab_id)
    );

-- LevelProgress table
CREATE TABLE levelprogress (
    level_progress_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    level_id INTEGER NOT NULL,
    questions_answered INTEGER NOT NULL DEFAULT 0,
    questions_correct INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL,
    level_status BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (level_progress_id)
);

-- OverallProgress table
CREATE TABLE overallprogress (
    overall_progress_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    level_status BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (overall_progress_id)
);

-- Insert some sample categories
INSERT INTO category (category_name) VALUES 
    ('Home'),
    ('Abroad'),
    ('School');

-- Insert some sample vocabulary (English to French)
INSERT INTO vocab (lang1_word, lang2_word, category_id) VALUES 
    -- Home
    ('house', 'maison', 1),
    ('kitchen', 'cuisine', 1),
    ('bedroom', 'chambre', 1),
    ('bathroom', 'salle de bain', 1),
    ('living room', 'salon', 1),
    ('garden', 'jardin', 1),
    ('door', 'porte', 1),
    ('window', 'fenêtre', 1),
    
    -- Abroad
    ('airport', 'aéroport', 2),
    ('hotel', 'hôtel', 2),
    ('restaurant', 'restaurant', 2),
    ('passport', 'passeport', 2),
    ('ticket', 'billet', 2),
    ('luggage', 'bagages', 2),
    ('train', 'train', 2),
    ('map', 'carte', 2),
    
    -- School
    ('book', 'livre', 3),
    ('pen', 'stylo', 3),
    ('classroom', 'salle de classe', 3),
    ('teacher', 'professeur', 3),
    ('student', 'étudiant', 3),
    ('homework', 'devoirs', 3),
    ('test', 'examen', 3),
    ('library', 'bibliothèque', 3);

-- Create a sample staff user (password: admin123)
INSERT INTO users (first_name, last_name, username, email, password, role) VALUES 
    ('Admin', 'User', 'admin', 'admin@syntaxschoolers.com', 'admintest', 'staff');

-- Create a sample student user (password: student123)
INSERT INTO users (first_name, last_name, username, email, password, role) VALUES 
    ('John', 'Doe', 'student', 'student@syntaxschoolers.com', 'studenttest', 'Student');
