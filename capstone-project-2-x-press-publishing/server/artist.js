const express = require('express');
const artistRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');


// Checks if param is a valid model
artistRouter.param('id', (req, res, next, artist) => {
	const artistId = Number(artist);
	db.get("SELECT * from Artist WHERE id = $id", {
		$id: artistId 
	}, (err, row) => {
		if (err || row === undefined) {
			return res.status(404).send();
		}
		req.artist = row;
		next();
	})
});

// Get all of Artist 
artistRouter.get('/', (req, res, next) => {

 	db.all("Select * from Artist WHERE is_currently_employed = 1", (err, rows) => {
	if (err) {
		res.status(404).send(err);
		return;
	}
   res.status(200).send({artists: rows});
  })
})

// Create a new Artist 
artistRouter.post('/', (req, res, next) => {
	const newArtist = req.body.artist;

 	db.run(`INSERT INTO Artist (name, date_of_birth, biography)
 		VALUES ($name, $date_of_birth, $biography)`, {
 			$name: newArtist.name,
 			$date_of_birth: newArtist.dateOfBirth,
 			$biography: newArtist.biography
 		}, function(err) {
 			if (err) {
				res.status(400).send(err);
 				return;
 			}
 		db.get("SELECT * FROM Artist WHERE id = $id", {$id: this.lastID}, (err, row) => {
   		res.status(201).send({artist: row});
 		})
 	})
})

// Get Artist 
artistRouter.get('/:id', (req, res, next) => {
	res.status(200).send({artist: req.artist});
})


// Update Artist 
artistRouter.put('/:id', (req, res, next) => {
	const updateArtist = req.body.artist;
	const artist = req.artist;
	db.run(`UPDATE Artist
		SET  name = ?1,
		  date_of_birth = ?2,
		  biography = ?3,
		  is_currently_employed = ?4
		WHERE 
			id = ?5
	`, {
		1: updateArtist.name,
		2: updateArtist.dateOfBirth,
		3: updateArtist.biography,
		4: updateArtist.isCurrentlyEmployed,
		5: artist.id
	 }, function (err) {
	 	if (err){
	 		// console.log(err);
			return res.status(400).send();
	 	}
 		db.get("SELECT * FROM Artist WHERE id = $id", {$id: artist.id}, (err, row) => {
   		res.status(200).send({artist: row});
 		})
	 }) 
});

// Delete Artist 
artistRouter.delete('/:id', (req, res, next) => {
	const updateArtist = req.body.artist;
	const artist = req.artist;
	db.run(`UPDATE Artist
		SET is_currently_employed = 0
		WHERE id = ?1
	`, {
		1: artist.id
	 }, function (err) {
	 	if (err){
			return res.status(400).send();
	 	}
 		db.get("SELECT * FROM Artist WHERE id = $id", {$id: artist.id}, (err, row) => {
   		res.status(200).send({artist: row});
 		})
	 }) 
});


module.exports = artistRouter;