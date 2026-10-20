const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    const categories = [
      "computer science",
      "Engineering",
      "Mass Communication",
      "Pharmacy",
      "Medicine",
      "Food",
      "Mathematics",
      "Software Development",
      "Data Science",
      "Artificial Intelligence",
      "Cybersecurity",
      "Information Technology",
      "Networking",
      "Physics",
      "Chemistry",
      "Biology",
      "Nursing",
      "Public Health",
      "Dentistry",
      "Veterinary Science",
      "Psychology",
      "Education",
      "Business",
      "Entrepreneurship",
      "Finance",
      "Accounting",
      "Economics",
      "Marketing",
      "Management",
      "Law",
      "Communication",
      "Journalism",
      "Film and Video",
      "Photography",
      "Music",
      "Creative Writing",
      "Languages",
      "Graphic Design",
      "UI and UX Design",
      "Architecture",
      "Construction",
      "Agriculture",
      "Environmental Science",
      "Food and Culinary Arts",
      "Health and Fitness",
      "Beauty and Fashion",
      "Hospitality and Tourism",
      "History",
      "Political Science",
      "Social Sciences",
      "Research Methods",
      "Product Management",
      "Sales",
      "Human Resources",
      "Personal Development",
      "Career Development",
      "Teaching and Learning",
      "Robotics",
      "Electronics",
      "Automotive",
      "Real Estate",
      "Project Management",
      "Supply Chain and Logistics",
      "Public Speaking",
      "Digital Marketing",
      "Content Creation",
      "Web Development",
      "Mobile App Development",
      "Cloud Computing",
      "Game Development",
      "Blockchain",
      "Statistics",
      "Accounting and Tax",
      "Banking",
      "Entrepreneurship and Startups",
    ];
    for (const name of categories) {
      await database.category.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    console.log("Success");
  } catch (error) {
    console.log("error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
