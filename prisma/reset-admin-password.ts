import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.RESET_PASSWORD;
  if (!password) {
    throw new Error("Set RESET_PASSWORD before resetting the admin password.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await prisma.user.updateMany({
    where: { email: "admin@liragrandhotel.com" },
    data: { passwordHash },
  });

  if (result.count !== 1) {
    throw new Error(`Expected one admin account to reset, found ${result.count}.`);
  }

  console.log("Admin password reset successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
