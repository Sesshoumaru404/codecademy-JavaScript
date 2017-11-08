const itemsRouter = require('express').Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Checks if param is a valid model
itemsRouter.param('menuItemId', (req, res, next, menuItem) => {
	const menuItemId = Number(menuItem);
	db.get("SELECT * from MenuItem WHERE id = $id and menu_id = $menu", {
		$id: menuItemId,
		$menu: req.menu.id
	}, (err, row) => {
		if (err || !row ) {
			var newError = new Error("Not Items found");
			newError.status = 404;
			return next(newError);
		}
		req.item = row;
		next();
	})
});

// Get all of item for an employee
itemsRouter.get('/', (req, res, next) => {
	const menuId = Number(req.menu.id);

 	db.all("SELECT * FROM MenuItem WHERE menu_id = $menuId;", {$menuId: menuId},  (err, rows) => {
		if (err) {
			next(err);
		} else {
	   	res.status(200).send({'menuItems': rows});
		}
  })
})

// Create a new Menu items  
itemsRouter.post('/', (req, res, next) => {
	const newItem = req.body.menuItem;

 	db.run(`INSERT INTO MenuItem (name, description, inventory, price, menu_id)
 		VALUES ($name, $desc, $inv, $price, $menuId)`, {
 			$name: newItem.name,
 			$desc: newItem.description,
 			$inv: newItem.inventory,
 			$price: newItem.price,
 			$menuId: Number(req.menu.id)
 		}, function(err) {
 			if (err) {
				var newError = new Error(err);
				newError.status = 400;
				return next(newError);
 			}
 		db.get("SELECT * FROM MenuItem WHERE id = $id", {$id: this.lastID}, (err, row) => {
   		res.status(201).send({menuItem: row});
 		})
 	})
})


// Update Items
itemsRouter.put('/:menuItemId', (req, res, next) => {
	const updatedMenu = req.body.menuItem;

	db.run(`UPDATE MenuItem SET name = ?1, description = ?2,
			inventory = ?3, price = ?4, menu_id = ?5
		WHERE id = ?6
	`, {
		1: updatedMenu.name,
		2: updatedMenu.description,
		3: updatedMenu.inventory,
		4: updatedMenu.price,
		5: Number(req.menu.id),
		6: Number(req.params.menuItemId)
	 }, function (err) {
	 	if (err){
			return res.status(400).send(err);
	 	}
 		db.get("SELECT * FROM MenuItem WHERE id = $id", {$id: req.params.menuItemId}, (err, row) => {
   		res.status(200).send({menuItem: row});
 		})
	 }) 
});

// Delete item 
itemsRouter.delete('/:menuItemId', (req, res, next) => {
	const menuItem = req.params.menuItemId;
	db.run(`DELETE FROM MenuItem WHERE id = ?1`, {
		1: menuItem
	 }, function (err) {
	 	if (err){
			return next(err);
	 	}
   	res.status(204).send();
	 }) 
});


module.exports = itemsRouter;
