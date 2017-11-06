const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

//Creat Database tables 

db.serialize(() => {
	db.run("DROP TABLE IF EXISTS Artist");
	db.run(`CREATE TABLE Artist (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name text NOT NULL,
		date_of_birth text NOT NULL,
		biography text NOT NULL,
		is_currently_employed INTEGER NOT NULL DEFAULT 1
	)`);
	db.run("DROP TABLE IF EXISTS Series");
	db.run(`CREATE TABLE Series (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name text NOT NULL,
		description text NOT NULL
	);`);
	db.run("DROP TABLE IF EXISTS Issue");
	db.run(`CREATE TABLE Issue (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name text NOT NULL,
		issue_number text NOT NULL,
		publication_date text NOT NULL,
		artist_id INTEGER NOT NULL, 
		series_id INTEGER NOT NULL
	);`);
				  
})