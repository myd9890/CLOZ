const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Received Token:', token); // Log the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log the decoded token
    const employee = await Employee.findOne({ _id: decoded._id });
    if (!employee) {
      throw new Error();
    }
    req.token = token;
    req.employee = employee;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
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