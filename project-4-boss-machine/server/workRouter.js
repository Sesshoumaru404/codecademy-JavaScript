const workRouter = require('express').Router({mergeParams: true});
const db = require('./db');

workRouter.get('/', (req, res, next) => {
	const miniontoFind = req.idtoFind;
	const work = db.getAllWorkFromDatabase(`${miniontoFind}`);
	if (work) {
		res.send(work);
	} else {
		res.status(404).send();
	}
})

workRouter.post('/', (req, res, next) => {
	const minionid = req.idtoFind;
	const work = db.getAllWorkFromDatabase(`${miniontoFind}`);
	if (work) {
		res.send(work);
	} else {
		res.status(404).send();
	}
})

module.exports = workRouter;
