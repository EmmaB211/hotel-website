/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require("bcryptjs");

const password = process.env.RESET_PASSWORD;
if (!password) {
  console.error("Set RESET_PASSWORD before running this script.");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

console.log(hash);