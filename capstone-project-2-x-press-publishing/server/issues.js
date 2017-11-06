const issuesRouter = require('express').Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');

// Checks if param is a valid model
issuesRouter.param('id', (req, res, next, issue) => {
	const issueId = Number(issue);
	db.get("SELECT * from Issue WHERE id = $id", {
		$id: issueId 
	}, (err, row) => {
		if (err || row === undefined) {
			return res.status(404).send();
		}
		req.issue = row;
		next();
	})
});

// Get all of issues for Series  
issuesRouter.get('/', (req, res, next) => {
	const seriesId = Number(req.series.id);

 	db.all("SELECT * from Issue WHERE series_id = $series", {$series: seriesId},  (err, rows) => {
	if (err) {
		console.log(err);
		res.status(404).send(err);
		next();
	}
   res.status(200).send({issues: rows});
  })
})

// Create a new Series 
issuesRouter.post('/', (req, res, next) => {
	const newIssue = req.body.issue;

 	db.run(`INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id)
 		VALUES ($name, $issue, $pub, $artist, $series)`, {
 			$name: newIssue.name,
 			$issue: newIssue.issueNumber,
 			$pub: newIssue.publicationDate,
 			$artist: Number(newIssue.artistId),
 			$series: Number(req.series.id)
 		}, function(err) {
 			if (err) {
				res.status(400).send(err);
 				return;
 			}
 		db.get("SELECT * FROM Issue WHERE id = $id", {$id: this.lastID}, (err, row) => {
   		res.status(201).send({issue: row});
 		})
 	})
})


// Update Issues 
issuesRouter.put('/:id', (req, res, next) => {
	const newIssue = req.body.issue;
	const issue = req.issue;
	db.run(`UPDATE Issue
		SET name = ?1,
			issue_number = ?2,
			publication_date = ?3,
			artist_id = ?4,
			series_id = ?5
		WHERE 
			id = ?6
	`, {
		1: newIssue.name,
		2: newIssue.issueNumber,
		3: newIssue.publicationDate,
		4: newIssue.artistId,
		5: issue.series_id,
		6: Number(issue.id)
	 }, function (err) {
	 	if (err){
			return res.status(400).send();
	 	}
 		db.get("SELECT * FROM Issue WHERE id = $id", {$id: issue.id}, (err, row) => {
   		res.status(200).send({issue: row});
 		})
	 }) 
});

// Delete Artist 
issuesRouter.delete('/:id', (req, res, next) => {
	const issue = req.issue;
	db.run(`DELETE FROM Issue WHERE id = ?1`, {
		1: issue.id
	 }, function (err) {
	 	if (err){
			return res.status(404).send();
	 	}
   	res.status(204).send();
	 }) 
});


module.exports = issuesRouter;