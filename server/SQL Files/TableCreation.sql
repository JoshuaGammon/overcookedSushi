CREATE TABLE Recipe (
	recipe_id int AUTO_INCREMENT,
    recipe_name varchar(45) NOT NULL,
    servings int,
    steps mediumtext NOT NULL,
    classification varchar(45),
    attribution varchar(45),
    PRIMARY KEY (recipe_id)
);

CREATE TABLE Ingredient (
	ingredient_id int AUTO_INCREMENT, 
    ingredient_name varchar(45) NOT NULL,
    category varchar(45),
    shelf_life int NOT NULL,
    PRIMARY KEY (ingredient_id)
);

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

CREATE TABLE User (
	username varchar(10),
    display_name varchar(20) NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE Personal_Recipes (
	username varchar(10),
    recipe_id int,
    PRIMARY KEY (username, recipe_id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id)
);

CREATE TABLE Allergy (
	username varchar(10),
    ingredient_id int,
    PRIMARY KEY (username, ingredient_id),
    FOREIGN KEY (username) REFERENCES User(username),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(ingredient_id)
);

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