const express = require('express');
const apiRouter = express.Router();
const workRouter = require('./workRouter');
const db = require('./db');

// Checks if param is a valid model
apiRouter.param('model', (req, res, next, id) => {
	const requestedModel = id;
	const models = ['minions', 'ideas', 'meetings'];
	if (models.includes(requestedModel)) {
		req.reqModel = requestedModel;
		next();
	} else {
		res.status(404).send('Not Found.');
	}
});

// Checks if id is a number
apiRouter.param('id', (req, res, next, id) => {
	const requestModel = req.reqModel;
	const idtoFind = Number(id);
	const validID = db.getFromDatabaseById(requestModel, `${idtoFind}`);
	if (idtoFind && validID) {
		req.validID = validID;
		next();
	} else {
		res.status(404).send(`${requestModel} ${id} Not Found.`);
	}
});


apiRouter.use('/:model/:id/work', workRouter);

// Get all of one type of model
apiRouter.get('/:model', (req, res, next) => {
	const model = req.reqModel;
	const allModels = db.getAllFromDatabase(model);
	if (allModels) {
		res.send(allModels);
	} else {
		res.status(404).send(`${model}: Not Found`);
	}
})

// Get one of one type of model
apiRouter.get('/:model/:id', (req, res, next) => {res.send(req.validID);})

// Create a new instance for a model
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

apiRouter.post('/:model', checkMillionDollarIdea, (req, res, next) => {
	const model = req.reqModel;
	let reqbody = req.body;
	if (model.match('meetings')) {reqbody = db.createMeeting();}
  	const newentry = db.addToDatabase(model,reqbody);
	if (newentry) {
		res.status(201).send(newentry)
	} else {
		res.status(404).send();

	}
})

// Updates an instance in a model
apiRouter.put('/:model/:id', checkMillionDollarIdea, (req, res, next) => {
  let updatemodel = db.updateInstanceInDatabase(req.reqModel, req.body);
  if (updatemodel) {
  	res.send(updatemodel);
  } else {
  	res.status(404).send();
  }
})

// Deletes an instance in a model
apiRouter.delete('/:model/:id', (req, res, next) => {
	const model = req.reqModel;
	let deleteInstance = db.deleteFromDatabasebyId(model,`${req.validID.id}`);
	if (deleteInstance){
		res.status(204).send();
	} else {
  		res.status(404).send();
 	}
});

// Delete all from in a model
apiRouter.delete('/:model', (req, res, next) => {
	const model = req.reqModel;
	let deleteModel;
	if (model.match('meetings')) {
		deleteModel = db.deleteAllFromDatabase(model);
	} 

	if (deleteModel){
		res.status(204).send();
	} else {
  		res.status(404).send();
 	}
});

module.exports = apiRouter;
