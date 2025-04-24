const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!employee) throw new Error();
    req.token = token;
    req.employee = employee;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.employee.role)) {
    return res.status(403).send({ error: 'Access denied.' });
  }
  next();
};

module.exports = { auth, authorize };