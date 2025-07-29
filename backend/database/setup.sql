DROP TABLE IF EXISTS vocab;
DROP TABLE IF EXISTS levelprogress;
DROP TABLE IF EXISTS overallprogress;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS category;


-- Users table
CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'Student' CHECK (role IN ('Student', 'Staff')),
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

-- Insert updated categories
INSERT INTO category (category_name) VALUES 
    ('Abroad'),
    ('Directions'),
    ('Time & Date');

-- Insert updated vocabulary (English to French)

-- Abroad (category_id = 1)
INSERT INTO vocab (lang1_word, lang2_word, category_id) VALUES 
    ('airport', 'aéroport', 1),
    ('hotel', 'hôtel', 1),
    ('restaurant', 'restaurant', 1),
    ('passport', 'passeport', 1),
    ('ticket', 'billet', 1),
    ('luggage', 'bagages', 1),
    ('train', 'train', 1),
    ('map', 'carte', 1);

-- Directions (category_id = 2)
INSERT INTO vocab (lang1_word, lang2_word, category_id) VALUES 
    ('left', 'gauche', 2),
    ('right', 'droite', 2),
    ('straight ahead', 'tout droit', 2),
    ('turn', 'tourner', 2),
    ('intersection', 'carrefour', 2),
    ('stop', 'arrêt', 2),
    ('sign', 'panneau', 2),
    ('traffic light', 'feu de signalisation', 2);

-- Time & Date (category_id = 3)
INSERT INTO vocab (lang1_word, lang2_word, category_id) VALUES 
    ('today', 'aujourd''hui', 3),
    ('tomorrow', 'demain', 3),
    ('yesterday', 'hier', 3),
    ('morning', 'matin', 3),
    ('afternoon', 'après-midi', 3),
    ('evening', 'soir', 3),
    ('night', 'nuit', 3),
    ('day', 'jour', 3),
    ('week', 'semaine', 3),
    ('month', 'mois', 3),
    ('year', 'année', 3),
    ('hour', 'heure', 3),
    ('minute', 'minute', 3),
    ('second', 'seconde', 3),
    ('now', 'maintenant', 3);

-- Create a sample staff user
INSERT INTO users (first_name, surname, username, password, role) VALUES 
    ('Admin', 'User', 'admin', 'admintest', 'Staff');

-- Create a sample student user
INSERT INTO users (first_name, surname, username, password, role) VALUES 
    ('John', 'Doe', 'student', 'studenttest', 'Student');