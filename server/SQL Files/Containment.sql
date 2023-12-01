DROP TABLE Containment;

CREATE TABLE Containment (
	recipe_id int,
    ingredient_id int, 
    quantity_numerator int DEFAULT 1,
    quantity_denominator int DEFAULT 1,
    measurement_type varchar(15) DEFAULT 'Unit(s)',
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(ingredient_id)
);

INSERT INTO Containment VALUES (1, 105, 2, 1, 'Cup(s)');
INSERT INTO Containment VALUES (1, 66, 2, 1, 'Cup(s)');
INSERT INTO Containment VALUES (1, 10, 14, 1, 'Ounce(s)');
INSERT INTO Containment VALUES (1, 27, 1, 1, 'Unit(s)');
INSERT INTO Containment VALUES (1, 1, 1, 1, 'Cup(s)');
INSERT INTO Containment VALUES (1, 93, 3, 4, 'Cup(s)');
INSERT INTO Containment VALUES (1, 38, 2, 1, 'Unit(s)');
INSERT INTO Containment VALUES (1, 109, 1, 2, 'Cup(s)');
INSERT INTO Containment VALUES (1, 71, 1, 1, 'Ounce(s)');
INSERT INTO Containment VALUES (1, 97, 1, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (1, 88, 1, 2, 'Teaspoon(s)');
INSERT INTO Containment VALUES (1, 11, 1, 2, 'Teaspoon(s)');
INSERT INTO Containment VALUES (1, 59, 1, 1, 'Ounce(s)');

INSERT INTO Containment VALUES (2, 101, 1, 1, 'Can(s)');
INSERT INTO Containment VALUES (2, 60, 2, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (2, 91, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (2, 95, 1, 2, 'Teaspoon(s)');
INSERT INTO Containment VALUES (2, 108, 1, 1, 'Cup(s)');
INSERT INTO Containment VALUES (2, 92, 1, 1, 'Teaspoon(s)');

INSERT INTO Containment VALUES (3, 21, 3, 2, 'Pound(s)');
INSERT INTO Containment VALUES (3, 88, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (3, 11, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (3, 86, 2, 1, 'Cup(s)');
INSERT INTO Containment VALUES (3, 38, 2, 1, 'Unit(s)');
INSERT INTO Containment VALUES (3, 79, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (3, 69, 1, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (3, 76, 8, 1, 'Ounce(s)');
INSERT INTO Containment VALUES (3, 35, 4, 1, 'Ounce(s)');

INSERT INTO Containment VALUES (4, 66, 1, 1, 'Pound(s)');
INSERT INTO Containment VALUES (4, 41, 18, 1, 'Ounce(s)');
INSERT INTO Containment VALUES (4, 69, 6, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (4, 89, 4, 1, 'Unit(s)');
INSERT INTO Containment VALUES (4, 93, 1, 1, 'Unit(s)');
INSERT INTO Containment VALUES (4, 88, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (4, 13, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (4, 98, 5, 1, 'Ounce(s)');
INSERT INTO Containment VALUES (4, 31, 2, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (4, 50, 2, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (4, 49, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (4, 103, 1, 1, 'Teaspoon(s)');

INSERT INTO Containment VALUES (5, 42, 2, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (5, 69, 2, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (5, 95, 1, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (5, 49, 2, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (5, 94, 1, 1, 'Pound(s)');
INSERT INTO Containment VALUES (5, 43, 1, 1, 'Pound(s)');

INSERT INTO Containment VALUES (6, 14, 2, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (6, 69, 1, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (6, 32, 4, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (6, 63, 6, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (6, 83, 2, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (6, 88, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (6, 11, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (6, 87, 1, 1, 'Pound(s)');
INSERT INTO Containment VALUES (6, 112, 1, 1, 'Unit(s)');
INSERT INTO Containment VALUES (6, 108, 4, 1, 'Cup(s)');
INSERT INTO Containment VALUES (6, 52, 2, 1, 'Cup(s)');

INSERT INTO Containment VALUES (7, 94, 1, 1, 'Pound(s)');
INSERT INTO Containment VALUES (7, 69, 3, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (7, 54, 1, 1, 'Unit(s)');
INSERT INTO Containment VALUES (7, 79, 1, 2, 'Teaspoon(s)');
INSERT INTO Containment VALUES (7, 88, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (7, 38, 4, 1, 'Unit(s)');
INSERT INTO Containment VALUES (7, 103, 2, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (7, 70, 1, 1, 'Cup(s)');
INSERT INTO Containment VALUES (7, 109, 1, 3, 'Cup(s)');
INSERT INTO Containment VALUES (7, 105, 2, 1, 'Cup(s)');
INSERT INTO Containment VALUES (7, 72, 3, 1, 'Tablespoon(s)');

INSERT INTO Containment VALUES (8, 75, 1, 1, 'Pound(s)');
INSERT INTO Containment VALUES (8, 14, 2, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (8, 95, 2, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (8, 42, 3, 2, 'Tablespoon(s)');
INSERT INTO Containment VALUES (8, 39, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (8, 91, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (8, 79, 1, 2, 'Teaspoon(s)');
INSERT INTO Containment VALUES (8, 38, 3, 1, 'Unit(s)');
INSERT INTO Containment VALUES (8, 27, 1, 1, 'Unit(s)');
INSERT INTO Containment VALUES (8, 108, 1, 2, 'Cup(s)');
INSERT INTO Containment VALUES (8, 56, 1, 1, 'Unit(s)');
INSERT INTO Containment VALUES (8, 45, 1, 4, 'Cup(s)');
INSERT INTO Containment VALUES (8, 92, 1, 1, 'Tablespoon(s)');

INSERT INTO Containment VALUES (9, 82, 1, 1, 'Unit(s)');
INSERT INTO Containment VALUES (9, 56, 2, 1, 'Cup(s)');
INSERT INTO Containment VALUES (9, 40, 2, 1, 'Cup(s)');
INSERT INTO Containment VALUES (9, 15, 1, 1, 'Cup(s)');
INSERT INTO Containment VALUES (9, 62, 1, 2, 'Cup(s)');
INSERT INTO Containment VALUES (9, 25, 1, 2, 'Cup(s)');
INSERT INTO Containment VALUES (9, 45, 1, 4, 'Cup(s)');
INSERT INTO Containment VALUES (9, 14, 1, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (9, 58, 3, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (9, 105, 3, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (9, 33, 2, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (9, 38, 1, 1, 'Unit(s)');
INSERT INTO Containment VALUES (9, 23, 1, 1, 'Unit(s)');

INSERT INTO Containment VALUES (10, 69, 7, 2, 'Tablespoon(s)');
INSERT INTO Containment VALUES (10, 80, 3, 1, 'Pound(s)');
INSERT INTO Containment VALUES (10, 67, 7, 4, 'Teaspoon(s)');
INSERT INTO Containment VALUES (10, 23, 6, 1, 'Unit(s)');
INSERT INTO Containment VALUES (10, 39, 2, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (10, 38, 3, 1, 'Unit(s)');
INSERT INTO Containment VALUES (10, 51, 1, 2, 'Unit(s)');
INSERT INTO Containment VALUES (10, 88, 3, 2, 'Teaspoon(s)');
INSERT INTO Containment VALUES (10, 100, 1, 1, 'Teaspoon(s)');
INSERT INTO Containment VALUES (10, 36, 1, 2, 'Teaspoon(s)');
INSERT INTO Containment VALUES (10, 27, 1, 1, 'Unit(s)');
INSERT INTO Containment VALUES (10, 25, 1, 2, 'Cup(s)');
INSERT INTO Containment VALUES (10, 62, 1, 2, 'Cup(s)');
INSERT INTO Containment VALUES (10, 58, 1, 1, 'Tablespoon(s)');
INSERT INTO Containment VALUES (10, 57, 2, 1, 'Unit(s)');