const express = require('express');
const apiRouter = express.Router();
const	workRouter = require('./workRouter');
const db = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

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
		req.idtoFind = idtoFind;
		next();
	} else {
		res.status(404).send(`#{request} #{id} Not Found.`);
	}
});


apiRouter.use('/minions/:id/work', workRouter);

// Get all of one type of model
apiRouter.get('/:model', (req, res, next) => {
	const model = req.reqModel;
	const allModels = db.getAllFromDatabase(model);
	if (allModels) {
		res.send(allModels);
	} else {
		res.status(404).send(`#{model}: Not Found`);
	}
})

// Get one of one type of model
apiRouter.get('/:model/:id', (req, res, next) => {
	const idtoFind = req.idtoFind;
	const displayData = db.getFromDatabaseById(req.reqModel, `${idtoFind}`);
	if (displayData){
		res.send(displayData);
	} else {
		res.status(404).send();
	}
})

// Create a new instance for a model
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
  const updatebody = req.body;
  const updatemodel = db.updateInstanceInDatabase(req.reqModel, updatebody);
  if (updatemodel) {
  	res.send(updatemodel);
  } else {
  	res.status(404).send();
  }
})

// Deletes an instance in a model
apiRouter.delete('/:model/:id', (req, res, next) => {
	const model = req.reqModel;
	const idtoFind = req.idtoFind;
	let deleteInstance;
	if (model.match('meetings')) {
		deleteInstance = db.deleteAllFromDatabase('meetings');
	} else {
		deleteInstance = db.deleteFromDatabasebyId(model,`${idtoFind}`)
	}
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

// Add your error handler here:
apiRouter.use((err, req, res, next) => {
  let status;
  if (err.status){
    status = err.status;
  }else {
    status = 500;
  }
  console.log(err.message);
  res.status(status).send(err.message);
});

module.exports = apiRouter;
