const workRouter = require('express').Router({mergeParams: true});
const db = require('./db');

// Only works for minons router
workRouter.use('/', (req, res, next) => {
	if (req.reqModel != 'minions'){
		res.status(404).send();
	}
	next();
});

// Checks if id is a number
workRouter.param('workid', (req, res, next, id) => {
	const workid = Number(id);
	const validID = db.getFromDatabaseById('work', `${workid}`);
	if (validID) {
		req.workid = validID;
		next();
	} else {
		res.status(404).send(`Work, ${id} Not Found.`);
	}
});

// Get all work for Minion
workRouter.get('/', (req, res, next) => {
	const miniontoFind = req.validID.id;
	const work = db.getAllWorkFromDatabase(`${miniontoFind}`);
	if (work) {
		res.send(work);
	} else {
		res.status(404).send();
	}
})

// Update a work instance
workRouter.post('/', (req, res, next) => {
  const newWork = db.addToDatabase(model,req.body);
  if (newWork) {
  	res.send(newWork);
  } else {
  	res.status(404).send();
  }
})

// Update a work instance
workRouter.put('/:workid', (req, res, next) => {
  const updatework = req.body;
  const oldwork = req.workid;
  if (updatework.minionId != oldwork.minionId) { return res.status(400).send() }
  const updatemodel = db.updateInstanceInDatabase('work', updatework);
  if (updatemodel) {
  	res.send(updatemodel);
  } else {
  	res.status(404).send();
  }
})

// Delete a work instance
workRouter.delete('/:workid', (req, res, next) => {
	let deleteInstance = db.deleteFromDatabasebyId('work',`${req.workid.id}`);
	if (deleteInstance){
		res.status(204).send();
	} else {
  		res.status(404).send();
 	}
})

module.exports = workRouter;
