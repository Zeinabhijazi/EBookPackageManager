--creating tables
CREATE TABLE process(
id SERIAL PRIMARY KEY,
name VARCHAR(20),
active BOOLEAN DEFAULT TRUE,
effectiveDate DATE
);
CREATE TABLE ebook(
id SERIAL PRIMARY KEY,
name VARCHAR(20),
isbn VARCHAR(20),
author VARCHAR(20),
ebook_price FLOAT,
ebook_rent_price FLOAT,
active BOOLEAN DEFAULT FALSE,
latestprocess_id INT NOT NULL REFERENCES process(id)
);
CREATE TABLE package(
id SERIAL PRIMARY KEY,
name VARCHAR(20),
subscription_price FLOAT,
active BOOLEAN DEFAULT FALSE,
latestprocess_id INT NOT NULL REFERENCES process(id)
);

CREATE TABLE ebooks_packages(
id SERIAL PRIMARY KEY,
active BOOLEAN DEFAULT FALSE,
ebook_id INT NOT NULL REFERENCES ebook(id),
package_id INT NOT NULL REFERENCES package(id),
latestprocess_id INT NOT NULL REFERENCES process(id)
);

CREATE TABLE ebooks_packages_diff(
id SERIAL PRIMARY KEY,
active BOOLEAN DEFAULT FALSE,
ebooks_packages_id INT NOT NULL REFERENCES ebooks_packages(id),
process_id INT NOT NULL REFERENCES process(id)
);

CREATE TABLE ebook_diff(
id SERIAL PRIMARY KEY,
name VARCHAR(20),
isbn VARCHAR(20),
author VARCHAR(20),
ebook_price FLOAT,
ebook_rent_price FLOAT,
active BOOLEAN DEFAULT FALSE,
ebook_id INT NOT NULL REFERENCES ebook(id),
process_id INT NOT NULL REFERENCES process(id)
);

CREATE TABLE package_diff(
id SERIAL PRIMARY KEY,
name VARCHAR(20),
subscription_price FLOAT,
active BOOLEAN DEFAULT FALSE,
package_id INT NOT NULL REFERENCES package(id),
process_id INT NOT NULL REFERENCES process(id)
);
