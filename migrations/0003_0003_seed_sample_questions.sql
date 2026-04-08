-- Migration: 0003_seed_sample_questions
-- Inserts 40 demo questions for the first registered user.
-- Silently does nothing if no user exists.
-- WARNING: Not idempotent — apply once per environment only.

-- =====================================================================
-- QUESTIONS (one INSERT per row to avoid D1 compound SELECT limits)
-- =====================================================================

INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'The Solar System: Largest Planet', 'Which planet in our solar system is the largest?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'World Capitals: France', 'What is the capital city of France?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Mathematics: Square Root', 'What is the square root of 144?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Literature: Shakespeare', 'Which play by William Shakespeare features the character Hamlet?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Human Biology: Largest Organ', 'What is the largest organ in the human body?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'World History: First Moon Landing', 'In which year did humans first land on the Moon?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Chemistry: Water Formula', 'What is the chemical formula for water?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Geography: Longest River', 'Which is the longest river in the world?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Sport: FIFA World Cup', 'Which country has won the most FIFA World Cup titles?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'General Knowledge: Olympic Rings', 'How many rings are on the Olympic flag?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Physics: Speed of Light', 'Approximately how fast does light travel in a vacuum?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'World Capitals: Japan', 'What is the capital city of Japan?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Mathematics: Prime Numbers', 'Which of the following numbers is a prime number?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Literature: Author of 1984', 'Who wrote the novel "1984"?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Biology: Photosynthesis', 'What gas do plants absorb during photosynthesis?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'World History: World War II End', 'In which year did World War II end?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Chemistry: Periodic Table', 'What is the symbol for gold on the periodic table?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Geography: Largest Continent', 'Which is the largest continent by land area?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Sport: Tennis Grand Slams', 'How many Grand Slam tournaments are played in tennis each year?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'General Knowledge: Mona Lisa Painter', 'Who painted the Mona Lisa?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Physics: Gravity', 'What force keeps planets in orbit around the Sun?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'World Capitals: Australia', 'What is the capital city of Australia?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Mathematics: Pythagorean Theorem', 'In a right-angled triangle with legs of length 3 and 4, what is the length of the hypotenuse?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Literature: Romeo and Juliet Setting', 'In which city is Shakespeare''s "Romeo and Juliet" set?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Biology: DNA', 'What does DNA stand for?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'World History: French Revolution', 'In which year did the French Revolution begin?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Chemistry: States of Matter', 'Which of the following is NOT a state of matter?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Geography: Highest Mountain', 'What is the highest mountain in the world?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Sport: Basketball Scoring', 'How many points is a standard field goal worth in basketball?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'General Knowledge: Continents', 'How many continents are there on Earth?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Physics: Boiling Point of Water', 'At what temperature (°C) does water boil at sea level?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'World Capitals: Brazil', 'What is the capital city of Brazil?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Mathematics: Fractions', 'What is 3/4 expressed as a decimal?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Literature: Harry Potter Author', 'Who wrote the Harry Potter series?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Biology: Cells', 'What is the powerhouse of the cell?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'World History: Great Wall of China', 'The Great Wall of China was primarily built to protect against invasions from which direction?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Chemistry: Oxygen Symbol', 'What is the chemical symbol for oxygen?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Geography: Amazon Rainforest', 'The Amazon rainforest is primarily located in which country?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'Sport: Cricket Teams', 'How many players are on a cricket team?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);
INSERT INTO questions (id, teacher_id, title, body, is_archived) SELECT lower(hex(randomblob(16))), u.id, 'General Knowledge: Oceans', 'How many oceans are there on Earth?', 0 FROM (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) u WHERE EXISTS (SELECT 1 FROM users);

-- =====================================================================
-- ANSWER CHOICES
-- =====================================================================

-- Q1: Largest Planet (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Jupiter', 1, 1 FROM questions q WHERE q.title = 'The Solar System: Largest Planet' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Saturn', 0, 2 FROM questions q WHERE q.title = 'The Solar System: Largest Planet' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Neptune', 0, 3 FROM questions q WHERE q.title = 'The Solar System: Largest Planet' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Uranus', 0, 4 FROM questions q WHERE q.title = 'The Solar System: Largest Planet' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q2: Capital of France (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Paris', 1, 1 FROM questions q WHERE q.title = 'World Capitals: France' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Lyon', 0, 2 FROM questions q WHERE q.title = 'World Capitals: France' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Marseille', 0, 3 FROM questions q WHERE q.title = 'World Capitals: France' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q3: Square Root of 144 (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '12', 1, 1 FROM questions q WHERE q.title = 'Mathematics: Square Root' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '14', 0, 2 FROM questions q WHERE q.title = 'Mathematics: Square Root' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '11', 0, 3 FROM questions q WHERE q.title = 'Mathematics: Square Root' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '16', 0, 4 FROM questions q WHERE q.title = 'Mathematics: Square Root' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q4: Shakespeare's Hamlet (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Hamlet', 1, 1 FROM questions q WHERE q.title = 'Literature: Shakespeare' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Macbeth', 0, 2 FROM questions q WHERE q.title = 'Literature: Shakespeare' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Othello', 0, 3 FROM questions q WHERE q.title = 'Literature: Shakespeare' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q5: Largest Organ (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Skin', 1, 1 FROM questions q WHERE q.title = 'Human Biology: Largest Organ' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Liver', 0, 2 FROM questions q WHERE q.title = 'Human Biology: Largest Organ' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Brain', 0, 3 FROM questions q WHERE q.title = 'Human Biology: Largest Organ' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Heart', 0, 4 FROM questions q WHERE q.title = 'Human Biology: Largest Organ' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q6: First Moon Landing (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1969', 1, 1 FROM questions q WHERE q.title = 'World History: First Moon Landing' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1965', 0, 2 FROM questions q WHERE q.title = 'World History: First Moon Landing' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1972', 0, 3 FROM questions q WHERE q.title = 'World History: First Moon Landing' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1975', 0, 4 FROM questions q WHERE q.title = 'World History: First Moon Landing' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q7: Water Formula (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'H2O', 1, 1 FROM questions q WHERE q.title = 'Chemistry: Water Formula' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'CO2', 0, 2 FROM questions q WHERE q.title = 'Chemistry: Water Formula' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'O2', 0, 3 FROM questions q WHERE q.title = 'Chemistry: Water Formula' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q8: Longest River (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'The Nile', 1, 1 FROM questions q WHERE q.title = 'Geography: Longest River' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'The Amazon', 0, 2 FROM questions q WHERE q.title = 'Geography: Longest River' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'The Yangtze', 0, 3 FROM questions q WHERE q.title = 'Geography: Longest River' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'The Mississippi', 0, 4 FROM questions q WHERE q.title = 'Geography: Longest River' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q9: FIFA World Cup (5 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Brazil', 1, 1 FROM questions q WHERE q.title = 'Sport: FIFA World Cup' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Germany', 0, 2 FROM questions q WHERE q.title = 'Sport: FIFA World Cup' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Italy', 0, 3 FROM questions q WHERE q.title = 'Sport: FIFA World Cup' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Argentina', 0, 4 FROM questions q WHERE q.title = 'Sport: FIFA World Cup' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'France', 0, 5 FROM questions q WHERE q.title = 'Sport: FIFA World Cup' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q10: Olympic Rings (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '5', 1, 1 FROM questions q WHERE q.title = 'General Knowledge: Olympic Rings' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '4', 0, 2 FROM questions q WHERE q.title = 'General Knowledge: Olympic Rings' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '6', 0, 3 FROM questions q WHERE q.title = 'General Knowledge: Olympic Rings' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '7', 0, 4 FROM questions q WHERE q.title = 'General Knowledge: Olympic Rings' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q11: Speed of Light (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '300,000 km/s', 1, 1 FROM questions q WHERE q.title = 'Physics: Speed of Light' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '150,000 km/s', 0, 2 FROM questions q WHERE q.title = 'Physics: Speed of Light' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1,000,000 km/s', 0, 3 FROM questions q WHERE q.title = 'Physics: Speed of Light' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '30,000 km/s', 0, 4 FROM questions q WHERE q.title = 'Physics: Speed of Light' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q12: Capital of Japan (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Tokyo', 1, 1 FROM questions q WHERE q.title = 'World Capitals: Japan' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Osaka', 0, 2 FROM questions q WHERE q.title = 'World Capitals: Japan' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Kyoto', 0, 3 FROM questions q WHERE q.title = 'World Capitals: Japan' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q13: Prime Numbers (5 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '17', 1, 1 FROM questions q WHERE q.title = 'Mathematics: Prime Numbers' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '21', 0, 2 FROM questions q WHERE q.title = 'Mathematics: Prime Numbers' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '15', 0, 3 FROM questions q WHERE q.title = 'Mathematics: Prime Numbers' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '9', 0, 4 FROM questions q WHERE q.title = 'Mathematics: Prime Numbers' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '25', 0, 5 FROM questions q WHERE q.title = 'Mathematics: Prime Numbers' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q14: Author of 1984 (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'George Orwell', 1, 1 FROM questions q WHERE q.title = 'Literature: Author of 1984' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Aldous Huxley', 0, 2 FROM questions q WHERE q.title = 'Literature: Author of 1984' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Ray Bradbury', 0, 3 FROM questions q WHERE q.title = 'Literature: Author of 1984' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'H.G. Wells', 0, 4 FROM questions q WHERE q.title = 'Literature: Author of 1984' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q15: Photosynthesis (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Carbon dioxide (CO2)', 1, 1 FROM questions q WHERE q.title = 'Biology: Photosynthesis' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Oxygen (O2)', 0, 2 FROM questions q WHERE q.title = 'Biology: Photosynthesis' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Nitrogen (N2)', 0, 3 FROM questions q WHERE q.title = 'Biology: Photosynthesis' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q16: World War II End (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1945', 1, 1 FROM questions q WHERE q.title = 'World History: World War II End' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1943', 0, 2 FROM questions q WHERE q.title = 'World History: World War II End' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1947', 0, 3 FROM questions q WHERE q.title = 'World History: World War II End' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1950', 0, 4 FROM questions q WHERE q.title = 'World History: World War II End' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q17: Symbol for Gold (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Au', 1, 1 FROM questions q WHERE q.title = 'Chemistry: Periodic Table' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Ag', 0, 2 FROM questions q WHERE q.title = 'Chemistry: Periodic Table' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Go', 0, 3 FROM questions q WHERE q.title = 'Chemistry: Periodic Table' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Gd', 0, 4 FROM questions q WHERE q.title = 'Chemistry: Periodic Table' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q18: Largest Continent (5 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Asia', 1, 1 FROM questions q WHERE q.title = 'Geography: Largest Continent' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Africa', 0, 2 FROM questions q WHERE q.title = 'Geography: Largest Continent' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'North America', 0, 3 FROM questions q WHERE q.title = 'Geography: Largest Continent' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Antarctica', 0, 4 FROM questions q WHERE q.title = 'Geography: Largest Continent' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Europe', 0, 5 FROM questions q WHERE q.title = 'Geography: Largest Continent' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q19: Tennis Grand Slams (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '4', 1, 1 FROM questions q WHERE q.title = 'Sport: Tennis Grand Slams' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '3', 0, 2 FROM questions q WHERE q.title = 'Sport: Tennis Grand Slams' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '5', 0, 3 FROM questions q WHERE q.title = 'Sport: Tennis Grand Slams' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q20: Mona Lisa Painter (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Leonardo da Vinci', 1, 1 FROM questions q WHERE q.title = 'General Knowledge: Mona Lisa Painter' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Michelangelo', 0, 2 FROM questions q WHERE q.title = 'General Knowledge: Mona Lisa Painter' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Raphael', 0, 3 FROM questions q WHERE q.title = 'General Knowledge: Mona Lisa Painter' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Botticelli', 0, 4 FROM questions q WHERE q.title = 'General Knowledge: Mona Lisa Painter' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q21: Gravity (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Gravity', 1, 1 FROM questions q WHERE q.title = 'Physics: Gravity' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Magnetism', 0, 2 FROM questions q WHERE q.title = 'Physics: Gravity' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Friction', 0, 3 FROM questions q WHERE q.title = 'Physics: Gravity' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q22: Capital of Australia (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Canberra', 1, 1 FROM questions q WHERE q.title = 'World Capitals: Australia' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Sydney', 0, 2 FROM questions q WHERE q.title = 'World Capitals: Australia' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Melbourne', 0, 3 FROM questions q WHERE q.title = 'World Capitals: Australia' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Brisbane', 0, 4 FROM questions q WHERE q.title = 'World Capitals: Australia' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q23: Pythagorean Theorem (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '5', 1, 1 FROM questions q WHERE q.title = 'Mathematics: Pythagorean Theorem' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '7', 0, 2 FROM questions q WHERE q.title = 'Mathematics: Pythagorean Theorem' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '6', 0, 3 FROM questions q WHERE q.title = 'Mathematics: Pythagorean Theorem' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '4', 0, 4 FROM questions q WHERE q.title = 'Mathematics: Pythagorean Theorem' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q24: Romeo and Juliet Setting (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Verona', 1, 1 FROM questions q WHERE q.title = 'Literature: Romeo and Juliet Setting' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Venice', 0, 2 FROM questions q WHERE q.title = 'Literature: Romeo and Juliet Setting' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Florence', 0, 3 FROM questions q WHERE q.title = 'Literature: Romeo and Juliet Setting' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q25: DNA (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Deoxyribonucleic Acid', 1, 1 FROM questions q WHERE q.title = 'Biology: DNA' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Deoxyribose Nucleic Array', 0, 2 FROM questions q WHERE q.title = 'Biology: DNA' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Double Nucleotide Amino Acid', 0, 3 FROM questions q WHERE q.title = 'Biology: DNA' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Directed Nucleic Acid', 0, 4 FROM questions q WHERE q.title = 'Biology: DNA' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q26: French Revolution (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1789', 1, 1 FROM questions q WHERE q.title = 'World History: French Revolution' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1776', 0, 2 FROM questions q WHERE q.title = 'World History: French Revolution' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1804', 0, 3 FROM questions q WHERE q.title = 'World History: French Revolution' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1815', 0, 4 FROM questions q WHERE q.title = 'World History: French Revolution' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q27: NOT a State of Matter (5 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Sound', 1, 1 FROM questions q WHERE q.title = 'Chemistry: States of Matter' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Solid', 0, 2 FROM questions q WHERE q.title = 'Chemistry: States of Matter' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Liquid', 0, 3 FROM questions q WHERE q.title = 'Chemistry: States of Matter' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Gas', 0, 4 FROM questions q WHERE q.title = 'Chemistry: States of Matter' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Plasma', 0, 5 FROM questions q WHERE q.title = 'Chemistry: States of Matter' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q28: Highest Mountain (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Mount Everest', 1, 1 FROM questions q WHERE q.title = 'Geography: Highest Mountain' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'K2', 0, 2 FROM questions q WHERE q.title = 'Geography: Highest Mountain' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Kangchenjunga', 0, 3 FROM questions q WHERE q.title = 'Geography: Highest Mountain' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Mont Blanc', 0, 4 FROM questions q WHERE q.title = 'Geography: Highest Mountain' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q29: Basketball Scoring (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '2', 1, 1 FROM questions q WHERE q.title = 'Sport: Basketball Scoring' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '1', 0, 2 FROM questions q WHERE q.title = 'Sport: Basketball Scoring' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '3', 0, 3 FROM questions q WHERE q.title = 'Sport: Basketball Scoring' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q30: Number of Continents (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '7', 1, 1 FROM questions q WHERE q.title = 'General Knowledge: Continents' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '6', 0, 2 FROM questions q WHERE q.title = 'General Knowledge: Continents' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '8', 0, 3 FROM questions q WHERE q.title = 'General Knowledge: Continents' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q31: Boiling Point of Water (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '100°C', 1, 1 FROM questions q WHERE q.title = 'Physics: Boiling Point of Water' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '90°C', 0, 2 FROM questions q WHERE q.title = 'Physics: Boiling Point of Water' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '110°C', 0, 3 FROM questions q WHERE q.title = 'Physics: Boiling Point of Water' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '80°C', 0, 4 FROM questions q WHERE q.title = 'Physics: Boiling Point of Water' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q32: Capital of Brazil (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Brasília', 1, 1 FROM questions q WHERE q.title = 'World Capitals: Brazil' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'São Paulo', 0, 2 FROM questions q WHERE q.title = 'World Capitals: Brazil' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Rio de Janeiro', 0, 3 FROM questions q WHERE q.title = 'World Capitals: Brazil' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Salvador', 0, 4 FROM questions q WHERE q.title = 'World Capitals: Brazil' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q33: Fractions (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '0.75', 1, 1 FROM questions q WHERE q.title = 'Mathematics: Fractions' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '0.34', 0, 2 FROM questions q WHERE q.title = 'Mathematics: Fractions' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '0.7', 0, 3 FROM questions q WHERE q.title = 'Mathematics: Fractions' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '0.8', 0, 4 FROM questions q WHERE q.title = 'Mathematics: Fractions' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q34: Harry Potter Author (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'J.K. Rowling', 1, 1 FROM questions q WHERE q.title = 'Literature: Harry Potter Author' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'C.S. Lewis', 0, 2 FROM questions q WHERE q.title = 'Literature: Harry Potter Author' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Roald Dahl', 0, 3 FROM questions q WHERE q.title = 'Literature: Harry Potter Author' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q35: Powerhouse of the Cell (2 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Mitochondria', 1, 1 FROM questions q WHERE q.title = 'Biology: Cells' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Nucleus', 0, 2 FROM questions q WHERE q.title = 'Biology: Cells' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q36: Great Wall of China (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'North', 1, 1 FROM questions q WHERE q.title = 'World History: Great Wall of China' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'South', 0, 2 FROM questions q WHERE q.title = 'World History: Great Wall of China' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'East', 0, 3 FROM questions q WHERE q.title = 'World History: Great Wall of China' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'West', 0, 4 FROM questions q WHERE q.title = 'World History: Great Wall of China' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q37: Symbol for Oxygen (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'O', 1, 1 FROM questions q WHERE q.title = 'Chemistry: Oxygen Symbol' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Ox', 0, 2 FROM questions q WHERE q.title = 'Chemistry: Oxygen Symbol' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'On', 0, 3 FROM questions q WHERE q.title = 'Chemistry: Oxygen Symbol' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Oy', 0, 4 FROM questions q WHERE q.title = 'Chemistry: Oxygen Symbol' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q38: Amazon Rainforest Country (5 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Brazil', 1, 1 FROM questions q WHERE q.title = 'Geography: Amazon Rainforest' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Peru', 0, 2 FROM questions q WHERE q.title = 'Geography: Amazon Rainforest' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Colombia', 0, 3 FROM questions q WHERE q.title = 'Geography: Amazon Rainforest' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Venezuela', 0, 4 FROM questions q WHERE q.title = 'Geography: Amazon Rainforest' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, 'Ecuador', 0, 5 FROM questions q WHERE q.title = 'Geography: Amazon Rainforest' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q39: Cricket Teams (4 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '11', 1, 1 FROM questions q WHERE q.title = 'Sport: Cricket Teams' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '9', 0, 2 FROM questions q WHERE q.title = 'Sport: Cricket Teams' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '10', 0, 3 FROM questions q WHERE q.title = 'Sport: Cricket Teams' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '12', 0, 4 FROM questions q WHERE q.title = 'Sport: Cricket Teams' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;

-- Q40: Number of Oceans (3 choices)
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '5', 1, 1 FROM questions q WHERE q.title = 'General Knowledge: Oceans' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '4', 0, 2 FROM questions q WHERE q.title = 'General Knowledge: Oceans' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
INSERT INTO answer_choices (id, question_id, text, is_correct, sort_order) SELECT lower(hex(randomblob(16))), q.id, '6', 0, 3 FROM questions q WHERE q.title = 'General Knowledge: Oceans' AND q.teacher_id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1) LIMIT 1;
