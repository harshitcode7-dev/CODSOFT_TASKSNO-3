const bcrypt = require('../backend/node_modules/bcrypt');

// Generate bcrypt hash for "password123"
const password = 'password123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Password hash for "password123":');
  console.log(hash);
  console.log('\nCopy this hash and replace the placeholder hashes in seed.sql');
});
