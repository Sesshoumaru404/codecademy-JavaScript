const express = require('express');

const menusRouter = express.Router();
const itemsRouter = require('./menuitems');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');

// Checks if param is a valid employee
menusRouter.param('menuId', (req, res, next, id) => {
	const menu = Number(id);
	db.get("SELECT * from Menu WHERE id = $id", {
		$id: menu 
	}, (err, row) => {
		// If error or invalid id 
		if (err || !row) {
			var newError = new Error("Menu not found");
			newError.status = 404;
			return next(newError);
		}
		req.menu = row;
		next();
	})
});

// Menu routes 
menusRouter.use('/:menuId/menu-items', itemsRouter);

// Get all of Current Menus  
menusRouter.get('/', (req, res, next) => {

 	db.all("Select * from Menu", (err, rows) => {
		if (err) {
			next(err)
		} else {
  			res.status(200).send({menus: rows});
		}
	})
});

// Get Menu 
menusRouter.get('/:menuId', (req, res, next) => {
	res.status(200).send({menu: req.menu});
})

// Create new Menu  
menusRouter.post('/', (req, res, next) => {
	const newMenu = req.body.menu;

	db.run(`INSERT INTO	Menu (title)
		VALUES ($title)`, {$title: newMenu.title },
		function(err) {
		if(err) {
			var newError = new Error(err);
			newError.status = 400;
			next(newError);
		} else {
			// Return new Created menu 
			db.get("SELECT * FROM Menu WHERE id = $id", {$id: this.lastID}, (err, row) => {
   			res.status(201).send({menu: row});
 			})
		}
	})
});

// Update an Menu  
menusRouter.put('/:menuId', (req, res, next) => {
	const updatedMenu = req.body.menu;

	db.run(`UPDATE Menu SET title = ?1 WHERE id = ?2`, {
		1: updatedMenu.title,
		2: req.menu.id
	}, function(err) {
		if(err) {
			var newError = new Error(err);
			newError.status = 400;
			next(newError);
		} else {
			// Return updated employee 
			db.get("SELECT * FROM Menu WHERE id = $id", {$id: req.menu.id}, (err, row) => {
   			res.status(200).send({menu: row});
 			})
		}
	})
});


// Delete Menu 
menusRouter.delete('/:menuId', (req, res, next) => {

	db.get(`SELECT * FROM MenuItem WHERE menu_id = $menuId`,
		{$menuId : req.params.menuId},
		(err, row) => {
		if (err) {
			return next(err);
		}
		if (row){
			var newError = new Error("Can't delete: Has related menu items.");
			newError.status = 400;
			next(err);
		} else {
			db.run("DELETE FROM Menu WHERE id = ?1", {
				1:  Number(req.menu.id)
			}, function (err) {
				if (err){
					res.status(400).send();
			 	}
			 	res.status(204).send();
			}) 
		}
	})
});

module.exports = menusRouter;