DROP TABLE IF EXISTS vocab;
DROP TABLE IF EXISTS sentences;
DROP TABLE IF EXISTS levelprogress;
DROP TABLE IF EXISTS overallprogress;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS level;


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

CREATE TABLE level (
    level_id INT GENERATED ALWAYS AS IDENTITY,
    level_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (level_id)
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

CREATE TABLE overallprogress (
    overall_progress_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    level_1_complete BOOLEAN DEFAULT FALSE,
    level_2_complete BOOLEAN DEFAULT FALSE,
    level_3_complete BOOLEAN DEFAULT FALSE,
    all_levels_complete BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (overall_progress_id)
);

--LEVEL 3
CREATE TABLE sentences (
  sentence_id INT GENERATED ALWAYS AS IDENTITY,
  english VARCHAR(100) NOT NULL,
  french VARCHAR(100) NOT NULL,
  shuffled VARCHAR(100) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES category(category_id),
  level_id INTEGER NOT NULL REFERENCES level (level_id),
  PRIMARY KEY (sentence_id)
);


INSERT INTO category (category_name) VALUES 
    ('Abroad'),
    ('Directions'),
    ('Time & Date');

INSERT INTO level (level_name) VALUES 
    ('Level 1'),
    ('Level 2'),
    ('Level 3');

INSERT INTO sentences (english, french, shuffled, category_id, level_id) VALUES
('Where is the station?', 'Où est la gare ?', 'est Où gare la ?', 1, 3),
('I need a ticket', 'J’ai besoin d’un billet', 'besoin billet J’ai d’un', 1, 3),
('Do you speak English?', 'Parlez-vous anglais ?', 'anglais ? Parlez-vous', 1, 3),
('I lost my luggage', 'J’ai perdu mes bagages', 'mes J’ai perdu bagages', 1, 3),
('Can you help me?', 'Pouvez-vous m’aider ?', 'm’aider Pouvez-vous ?', 1, 3);


INSERT INTO sentences (english, french, shuffled, category_id, level_id) VALUES
('Turn left at the corner', 'Tournez à gauche au coin', 'Tournez coin à gauche au', 2, 3),
('Go straight ahead', 'Allez tout droit', 'tout droit Allez', 2, 3),
('How do I get to the station?', 'Comment puis-je aller à la gare ?', 'aller gare ? à Comment puis-je la', 2, 3),
('Take the second street on the right', 'Prenez la deuxième rue à droite', 'droite Prenez deuxième rue la à', 2, 3),
('Is it far from here?', 'Est-ce loin d’ici ?', 'loin Est-ce ? d’ici', 2, 3);


INSERT INTO sentences (english, french, shuffled, category_id, level_id) VALUES
('What time is it?', 'Quelle heure est-il ?', 'Quelle heure ? est-il', 3, 3),
('It is ten o"clock', 'Il est dix heures', 'dix heures Il est', 3, 3),
('It is Thursday', 'C’est jeudi', 'C’est jeudi', 3, 3),
('My birthday is in July', 'Mon anniversaire est en juillet', 'en Mon est juillet anniversaire', 3, 3),
('We are meeting at 3 PM', 'Nous nous retrouvons à quinze heures', 'à quinze Nous heures retrouvons nous', 3, 3);





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
INSERT INTO users (first_name, last_name, username, email, password, role) VALUES 
    ('Admin', 'User', 'admin', 'admin@syntaxschoolers.com', 'admintest', 'staff');

-- Create a sample student user
INSERT INTO users (first_name, last_name, username, email, password, role) VALUES 
    ('John', 'Doe', 'student', 'student@syntaxschoolers.com', 'studenttest', 'Student');
