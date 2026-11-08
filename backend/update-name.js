const mongoose = require('mongoose');

async function update() {
  await mongoose.connect('mongodb://127.0.0.1:27017/meetus');
  await mongoose.connection.db.collection('users').updateOne(
    { email: 'demo@meetus.mz' },
    { $set: { name: 'Eduardo Mondlane' } }
  );
  console.log('Updated user name to Eduardo Mondlane');
  process.exit(0);
}

update();
