import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const cities = [
  "Hyderabad",
  "Bangalore",
  "Chennai",
  "Mumbai",
  "Delhi",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Vijayawada",
  "Visakhapatnam",
];

function getReviewSummary(rating: number) {
  if (rating >= 4.8) {
    return "Students highly praise the placements, faculty, infrastructure, and campus life.";
  }

  if (rating >= 4.5) {
    return "Students appreciate the academic environment, placement opportunities, and supportive faculty.";
  }

  if (rating >= 4.0) {
    return "Students report a balanced academic experience with decent placements and extracurricular opportunities.";
  }

  return "Students mention affordable education and improving facilities, though placement opportunities vary across departments.";
}

async function main() {
  await prisma.college.deleteMany();

  const baseColleges = [
    { name: "BITS Pilani", location: "Pilani" },
    { name: "BITS Goa", location: "Goa" },
    { name: "BITS Hyderabad", location: "Hyderabad" },

    { name: "VIT Vellore", location: "Vellore" },
    { name: "VIT Chennai", location: "Chennai" },

    { name: "KL University", location: "Vijayawada" },

    { name: "IIIT Hyderabad", location: "Hyderabad" },
    { name: "IIIT Bangalore", location: "Bangalore" },

    { name: "NIT Trichy", location: "Tiruchirappalli" },
    { name: "NIT Warangal", location: "Warangal" },
    { name: "NIT Surathkal", location: "Surathkal" },
    { name: "NIT Calicut", location: "Kozhikode" },
    { name: "NIT Rourkela", location: "Rourkela" },

    { name: "SRM University", location: "Chennai" },

    { name: "Manipal Institute of Technology", location: "Manipal" },

    { name: "Amrita Vishwa Vidyapeetham", location: "Coimbatore" },

    { name: "Thapar Institute of Engineering", location: "Patiala" },

    { name: "PSG College of Technology", location: "Coimbatore" },

    { name: "RV College of Engineering", location: "Bangalore" },

    { name: "PES University", location: "Bangalore" },

    { name: "Jadavpur University", location: "Kolkata" },

    { name: "DTU", location: "Delhi" },

    { name: "NSUT", location: "Delhi" },

    { name: "COEP Pune", location: "Pune" },

    { name: "MIT Pune", location: "Pune" },

    { name: "LPU", location: "Jalandhar" },

    { name: "Chandigarh University", location: "Mohali" },

    { name: "SASTRA University", location: "Thanjavur" },

    { name: "KIIT University", location: "Bhubaneswar" },

    { name: "Anna University", location: "Chennai" },
  ];

  const colleges = [];

  for (const college of baseColleges) {
  const rating = Number(
    (Math.random() * 1.5 + 3.5).toFixed(1)
  );

  colleges.push({
    name: college.name,
    location: college.location,

    fees:
      Math.floor(Math.random() * 400000) + 100000,

    rating,

    description:
      `${college.name} is a reputed institution known for engineering and technology programs.`,

    courses: [
      "Computer Science Engineering",
      "Electronics & Communication",
      "Mechanical Engineering",
    ],

    highestPackage:
      Math.floor(Math.random() * 40) + 20,

    averagePackage:
      Math.floor(Math.random() * 10) + 5,

    placementRate:
      Math.floor(Math.random() * 20) + 80,

    reviewSummary:
      getReviewSummary(rating),
  });
}

  for (let i = 1; i <= 170; i++) {
  const rating = Number(
  (Math.random() * 0.8 + 3.5).toFixed(1)
);

  colleges.push({
    name: `Global Institute of Technology ${i}`,

    location:
      cities[Math.floor(Math.random() * cities.length)],

    fees:
      Math.floor(Math.random() * 400000) + 100000,

    rating,

    description:
      "A leading engineering institution ranked among emerging colleges.",

    courses: [
      "Computer Science Engineering",
      "Information Technology",
      "Civil Engineering",
    ],

    highestPackage:
      Math.floor(Math.random() * 25) + 10,

    averagePackage:
      Math.floor(Math.random() * 8) + 3,

    placementRate:
      Math.floor(Math.random() * 25) + 65,

    reviewSummary:
      getReviewSummary(rating),
  });
}

  await prisma.college.createMany({
    data: colleges,
  });

  console.log(`🔥 Seeded ${colleges.length} colleges`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });