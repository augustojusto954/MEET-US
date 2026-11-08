const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

async function fixPassword() {
  await mongoose.connect('mongodb://127.0.0.1:27017/meetus');
  const hash = await bcrypt.hash('demo1234', 10);
  await mongoose.connection.db.collection('users').updateOne(
    { email: 'demo@meetus.mz' },
    { $set: { password: hash } }
  );
  console.log('Fixed demo password. New hash:', hash);

  // Verify
  const user = await mongoose.connection.db.collection('users').findOne({ email: 'demo@meetus.mz' });
  const match = await bcrypt.compare('demo1234', user.password);
  console.log('Verify match:', match);

  process.exit(0);
}

fixPassword();
