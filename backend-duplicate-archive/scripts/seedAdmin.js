// Creates the first admin account from environment variables.
// Run with: npm run seed:admin
// After running once, rotate/remove ADMIN_SEED_PASSWORD from .env for safety.

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

async function seed() {
  const { ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD } = process.env;

  if (!ADMIN_SEED_EMAIL || !ADMIN_SEED_PASSWORD) {
    console.error('ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set in .env before seeding.');
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ email: ADMIN_SEED_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`Admin already exists for ${ADMIN_SEED_EMAIL}. Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  const admin = await Admin.create({
    name: ADMIN_SEED_NAME || 'Admin',
    email: ADMIN_SEED_EMAIL.toLowerCase(),
    password: ADMIN_SEED_PASSWORD, // hashed automatically by the pre-save hook
    role: 'superadmin',
  });

  console.log(`Admin account created: ${admin.email}`);
  console.log('Please rotate ADMIN_SEED_PASSWORD in .env now that the account exists.');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
