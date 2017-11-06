const express = require('express');
const seriesRouter = express.Router();
const issuesRouter = require('./issues');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');


sqlite3.verbose();
// // Checks if param is a valid model
seriesRouter.param('id', (req, res, next, series) => {
	const seriesId = Number(series);
	db.get("SELECT * from Series WHERE id = $id", {
		$id: seriesId 
	}, (err, row) => {
		if (err || row === undefined) {
			return res.status(404).send();
		}
		req.series = row;
		next();
	})
});

// Get all of Series 
seriesRouter.get('/', (req, res, next) => {

 	db.all("Select * from Series", (err, rows) => {
	if (err) {
		res.status(404).send(err);
		return;
	}
   res.status(200).send({series: rows});
  })
})

// // Create a new Series 
seriesRouter.post('/', (req, res, next) => {
	const newSeries = req.body.series;

 	db.run(`INSERT INTO Series (name, description)
 		VALUES ($name, $description)`, {
 			$name: newSeries.name,
 			$description: newSeries.description,
 		}, function(err) {
 			if (err) {
				res.status(400).send(err);
 				return;
 			}
 		db.get("SELECT * FROM Series WHERE id = $id", {$id: this.lastID}, (err, row) => {
   		res.status(201).send({series: row});
 		})
 	})
})

// // Get Series 
seriesRouter.get('/:id', (req, res, next) => {
	res.status(200).send({series: req.series});
})


// // Update Series 
seriesRouter.put('/:id', (req, res, next) => {
	const newSeries = req.body.series;
	const series = req.series;
	db.run(`UPDATE Series
		SET  name = ?1,
		  description = ?2
		WHERE 
			id = ?3
	`, {
		1: newSeries.name,
		2: newSeries.description,
		3: series.id
	 }, function (err) {
	 	if (err){
	 		// console.log(err);
			return res.status(400).send();
	 	}
 		db.get("SELECT * FROM Series WHERE id = $id", {$id: series.id}, (err, row) => {
   		res.status(200).send({series: row});
 		})
	 }) 
});

// // Delete Artist 
seriesRouter.delete('/:id', (req, res, next) => {
	const seriesId = Number(req.series.id);
	db.get(`SELECT * FROM Issue WHERE series_id = ${seriesId}`, (err, row) =>{
		if (err) {
			console.log(err);
		}
		// If not Issues Delete
		if (row){
			res.status(400).send();
		} else {
			db.run("DELETE FROM Series WHERE id = ?1", {
				1: seriesId
			 }, function (err) {
			 	if (err){
					res.status(404).send();
			 	}
			 	console.log(this);
			 	if (this.changes === 1){
			 		res.status(204).send();
			 		// return;
			 	} else {
			 		res.status(404).send();
			 		// return;
			 	}
			 }) 
		}

	})
});

// Issues routes 
seriesRouter.use('/:id/issues', issuesRouter);


module.exports = seriesRouter;