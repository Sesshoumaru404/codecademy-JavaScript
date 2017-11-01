const checkMillionDollarIdea = (req, res, next) => {
	// if not Ideas skip middleware
	if (req.reqModel != 'ideas') {return next();}

	const numWeeks = Number(req.body.numWeeks);
	const weeklyRevenue = Number(req.body.weeklyRevenue);
	const total = (numWeeks * weeklyRevenue);
	const isMillion = total >= 1000000;

	if (!isMillion || !numWeeks || !weeklyRevenue || isNaN(total)){
		res.status(400).send();
	} else {
		return next();
	} 
	
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
