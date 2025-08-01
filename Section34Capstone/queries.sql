-- Paste these into pgAdmin4 --

-- CREATE DATABASE --
CREATE DATABASE book_app
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE book_app
    IS 'Database for the Books I Have Read project';

-- CREATE TABLE --
CREATE TABLE entries(
	isbn CHAR(13) PRIMARY KEY,
	title TEXT NOT NULL,
	author TEXT NOT NULL,
	rating SMALLINT NOT NULL,
	date DATE NOT NULL,
    cover TEXT,
	comment TEXT
);

-- SAMPLE DATA --
-- From https://sive.rs/book/ --
INSERT INTO entries
VALUES (
    '9780806541228',
    'You Can Negotiate Anything',
    'Herb Cohen',
    10,
    TO_DATE('08/02/2023', 'DD/MM/YYYY'),
    'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1592879329i/53232637.jpg',
    'Everything is negotiable. Challenge authority. You have the power in any situation. This is how to realize it and use it. A must-read classic from 1980 from a master negotiator. My notes here aren''t enough because the little book is filled with so many memorable stories — examples of great day-to-day moments of negotiation that will stick in your head for when you need them. (I especially loved the one about the power of the prisoner in solitary confinement.) So go buy and read the book. I''m giving it a 10/10 rating even though the second half of the book loses steam, because the first half is so crucial.'
    ), (
    '9781590308318',
    'The Listening Book',
    'W.A. Mathieu',
    10,
    TO_DATE('03/09/2023', 'DD/MM/YYYY'),
    'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333580724l/13136146.jpg',
    'Everyone should read this book of little essays about listening. It teaches your ears to pay more attention. It calls your attention to sounds you hadn''t noticed. It''s beautifully written, and makes your life better. I read it twice, 24 years ago, and reading it again this week, it was even better than I remembered. '
);
