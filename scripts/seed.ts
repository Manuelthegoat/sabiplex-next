const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "computer science" },
        { name: "Engineering" },
        { name: "mass comm" },
        { name: "Pharmacy" },
        { name: "Medicine" },
        { name: "Food" },
        { name: "Mathematics" },
      ],
    });
    console.log("Success")
  } catch (error) {
    console.log("error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main()