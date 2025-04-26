const bcrypt = require('bcryptjs');

// Define the password to hash
const plainTextPassword = 'E002';

// Generate a salt
const salt = bcrypt.genSaltSync(10);

// Hash the password
const hashedPassword = bcrypt.hashSync(plainTextPassword, salt);

// Output the hashed password
console.log('Hashed Password:', hashedPassword);