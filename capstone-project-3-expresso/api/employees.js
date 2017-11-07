const express = require('express');

const employeesRouter = express.Router();
const timesheetRouter = require('./timesheet');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');

// Checks if param is a valid employee
employeesRouter.param('employeeId', (req, res, next, id) => {
	const employee = Number(id);
	db.get("SELECT * from Employee WHERE id = $id", {
		$id: employee 
	}, (err, row) => {
		// If error or invalid id 
		if (err || !row) {
			var newError = new Error("Employee not found");
			newError.status = 404;
			return next(newError);
		}
		req.employee = row;
		next();
	})
});

// Timesheets routes 
employeesRouter.use('/:employeeId/timesheets', timesheetRouter);

// Get all of Current Employees  
employeesRouter.get('/', (req, res, next) => {

 	db.all("Select * from Employee WHERE is_current_employee = 1", (err, rows) => {
		if (err) {
			next(err)
		} else {
  			res.status(200).send({employees: rows});
		}
	})
});

// Get Employee 
employeesRouter.get('/:employeeId', (req, res, next) => {
	res.status(200).send({employee: req.employee});
})

// Create new Employee  
employeesRouter.post('/', (req, res, next) => {
	const newEmployee = req.body.employee;

	db.run(`INSERT INTO	Employee (name, position, wage)
		VALUES ($name, $position, $wage)`, {
		$name: newEmployee.name,
		$position: newEmployee.position,
		$wage: newEmployee.wage
	}, function(err) {
		if(err) {
			var newError = new Error(err);
			newError.status = 400;
			next(newError);
		} else {
			// Return new Created employee 
			db.get("SELECT * FROM Employee WHERE id = $id", {$id: this.lastID}, (err, row) => {
   			res.status(201).send({employee: row});
 			})
		}
	})
});

// Update an Employee  
employeesRouter.put('/:employeeId', (req, res, next) => {
	const updatedEmployee = req.body.employee;

	db.run(`UPDATE Employee SET name = ?1, position = ?2, wage = ?3 WHERE id = ?4`, {
		1: updatedEmployee.name,
		2: updatedEmployee.position,
		3: updatedEmployee.wage,
		4: req.employee.id
	}, function(err) {
		if(err) {
			var newError = new Error(err);
			newError.status = 400;
			next(newError);
		} else {
			// Return updated employee 
			db.get("SELECT * FROM Employee WHERE id = $id", {$id: req.employee.id}, (err, row) => {
   			res.status(200).send({employee: row});
 			})
		}
	})
});

// Delete Employee 
employeesRouter.delete('/:employeeId', (req, res, next) => {
	db.run(`UPDATE Employee 
		SET is_current_employee = 0
		WHERE id = ?1
	`, { 1: req.employee.id },
	function (err) {
	 	if (err){
	 		return next(err);
	 	}
 		db.get("SELECT * FROM Employee WHERE id = $id", {$id: req.employee.id}, (err, row) => {
   		res.status(200).send({employee: row});
 		})
	 }) 
});



module.exports = employeesRouter;