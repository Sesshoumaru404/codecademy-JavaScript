const timesheetRouter = require('express').Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');

// Checks if param is a valid model
timesheetRouter.param('timesheetId', (req, res, next, timesheet) => {
	const timesheetId = Number(timesheet);
	db.get("SELECT * from Timesheet WHERE id = $id", {
		$id: timesheetId 
	}, (err, row) => {
		if (err || !row ) {
			var newError = new Error("Not Timesheet found");
			newError.status = 404;
			return next(newError);
		}
		req.timesheet = row;
		next();
	})
});

// // Get all of timesheets for an employee
timesheetRouter.get('/', (req, res, next) => {
	const employeeId = Number(req.employee.id);

 	db.all("SELECT * from Timesheet WHERE employee_id = $employee", {$employee: employeeId},  (err, rows) => {
	if (err) {
		next(err);
	} else {
   	res.status(200).send({timesheets: rows});
	}
  })
})

// // Create a new timesheets 
timesheetRouter.post('/', (req, res, next) => {
	const newTimesheet  = req.body.timesheet;

 	db.run(`INSERT INTO Timesheet (hours, rate, date, employee_id)
 		VALUES ($hours, $rate, $date, $employee)`, {
 			$hours: newTimesheet.hours,
 			$rate: newTimesheet.rate,
 			$date: newTimesheet.date,
 			$employee: Number(req.employee.id)
 		}, function(err) {
 			if (err) {
			var newError = new Error(err);
			newError.status = 400;
			return next(newError);
 			}
 		db.get("SELECT * FROM Timesheet WHERE id = $id", {$id: this.lastID}, (err, row) => {
   		res.status(201).send({timesheet: row});
 		})
 	})
})


// Update Timesheet 
timesheetRouter.put('/:timesheetId', (req, res, next) => {
	const updatedTimesheet = req.body.timesheet;

	db.run(`UPDATE Timesheet SET hours = ?1, rate = ?2,
			date = ?3, employee_id = ?4
		WHERE id = ?5
	`, {
		1: updatedTimesheet.hours,
		2: updatedTimesheet.rate,
		3: updatedTimesheet.date,
		4: Number(req.employee.id),
		5: Number(req.timesheet.id)
	 }, function (err) {
	 	if (err){
			return res.status(400).send(err);
	 	}
 		db.get("SELECT * FROM Timesheet WHERE id = $id", {$id: req.timesheet.id}, (err, row) => {
   		res.status(200).send({timesheet: row});
 		})
	 }) 
});

// // Delete timesheet 
timesheetRouter.delete('/:timesheetId', (req, res, next) => {
	const timesheet = req.timesheet;
	db.run(`DELETE FROM Timesheet WHERE id = ?1`, {
		1: timesheet.id
	 }, function (err) {
	 	if (err){
			return next(err);
	 	}
   	res.status(204).send();
	 }) 
});


module.exports = timesheetRouter;