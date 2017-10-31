const checkMillionDollarIdea = (req, res, next) => {
	// if not Ideas skip middleware
	const model = new String(req.reqModel);
	if (!model.match('ideas')) {return next();}

	const numWeeks = Number(req.body.numWeeks);
	if (!numWeeks) {return res.status(404).send()}
	const weeklyRevenue = Number(req.body.weeklyRevenue);
	if (!weeklyRevenue) {return res.status(404).send()}
	const isMillion = (numWeeks * weeklyRevenue) >= 1000000;

	if (isMillion){
		return next();
	} else {
		const err = new Error('Not Million');
		err.status = 400;
		return next(err);
	} 
	
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
