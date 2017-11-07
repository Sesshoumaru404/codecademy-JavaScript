const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

// Drop old tables if exist and create new ones 

db.serialize(() => {
	//Create Employee table 
	db.run("DROP TABLE IF EXISTS Employee");
	db.run(`CREATE TABLE Employee (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		position TEXT NOT NULL,
		wage INTEGER NOT NULL,
		is_current_employee INTEGER NOT NULL DEFAULT 1
	);`);

	//Create Timesheet table 
	db.run("DROP TABLE IF EXISTS Timesheet");
	db.run(`CREATE TABLE Timesheet (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		hours INTEGER NOT NULL,
		rate INTEGER NOT NULL,
		date INTEGER NOT NULL,	
		employee_id INTEGER NOT NULL,
      FOREIGN KEY('employee_id') REFERENCES 'Employee'('id')	
	);`);

	//Create Menu table 
	db.run("DROP TABLE IF EXISTS Menu");
	db.run(`CREATE TABLE Menu (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title text NOT NULL
	);`);

	//Create MenuItem table 
	db.run("DROP TABLE IF EXISTS MenuItem");
	db.run(`CREATE TABLE MenuItem (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name text NOT NULL,
		description TEXT,
		inventory INTEGER NOT NULL,
		price INTEGER NOT NULL,
		menu_id INTERGER NOT NULL,
      FOREIGN KEY('menu_id') REFERENCES 'Menu'('id')
	);`);				  
})