DROP TABLE Pantry;

CREATE TABLE Pantry (
	username varchar(10),
    ingredient_id int,
    bought_date date DEFAULT (CURRENT_DATE),
    quantity_numerator int DEFAULT 1,
    quantity_denominator int DEFAULT 1,
	measurement_type varchar(15) DEFAULT 'Unit(s)',
    PRIMARY KEY (username, ingredient_id, bought_date),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(ingredient_id)
);

DROP TABLE Grocery_List;

CREATE TABLE Grocery_List (
	username varchar(10),
    ingredient_id int,
    quantity_numerator int DEFAULT 1,
    quantity_denominator int DEFAULT 1,
	measurement_type varchar(15) DEFAULT 'Unit(s)',
    PRIMARY KEY (username, ingredient_id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(ingredient_id)
);

INSERT INTO Pantry VALUES('juliac', 1, CURDATE(), 8, 1, 'Cup(s)');
INSERT INTO Pantry VALUES('juliac', 24, CURDATE(), 2, 1, 'Cup(s)');
INSERT INTO Pantry VALUES('juliac', 27, CURDATE(), 1, 1, 'Unit(s)');
INSERT INTO Pantry VALUES('juliac', 32, CURDATE(), 20, 1, 'Tablespoon(s)');
INSERT INTO Pantry VALUES('juliac', 37, CURDATE(), 1, 1, 'Unit(s)');
INSERT INTO Pantry VALUES('juliac', 38, CURDATE(), 4, 1, 'Unit(s)');
INSERT INTO Pantry VALUES('juliac', 41, CURDATE(), 16, 1, 'Ounce(s)');
INSERT INTO Pantry VALUES('juliac', 61, CURDATE(), 4, 1, 'Cup(s)');
INSERT INTO Pantry VALUES('juliac', 103, CURDATE(), 8, 1, 'Tablespoon(s)');
INSERT INTO Pantry VALUES('juliac', 126, CURDATE(), 8, 1, 'Teaspoon(s)');
INSERT INTO Pantry VALUES('juliac', 134, CURDATE(), 10, 1, 'Tablespoon(s)');

INSERT INTO Pantry VALUES('juliac', 42, CURDATE(), 2, 1, 'Tablespoon(s)');
INSERT INTO Pantry VALUES('juliac', 43, CURDATE(), 1, 1, 'Pound(s)');
INSERT INTO Pantry VALUES('juliac', 49, CURDATE(), 2, 1, 'Teaspoon(s)');
INSERT INTO Pantry VALUES('juliac', 69, CURDATE(), 2, 1, 'Tablespoon(s)');
INSERT INTO Pantry VALUES('juliac', 94, CURDATE(), 1, 1, 'Pound(s)');
INSERT INTO Pantry VALUES('juliac', 95, CURDATE(), 2, 1, 'Tablespoon(s)');

INSERT INTO Pantry VALUES('juliac', 60, CURDATE(), 2, 1, 'Tablespoon(s)');
INSERT INTO Pantry VALUES('juliac', 91, CURDATE(), 1, 1, 'Teaspoon(s)');
INSERT INTO Pantry VALUES('juliac', 108, CURDATE(), 1, 1, 'Cup(s)');