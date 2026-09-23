import mongoose from "mongoose";
import Competition from "./dist/models/Competition.model.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

// -------------------------
// Data pools
// -------------------------

const competitionNames = [
  "National Dance Championship",
  "Battle of the Bands",
  "India's Got Talent - Campus Edition",
  "Artistic Vision",
  "Rhythm Revolution",
  "The Grand Singing Challenge",
  "Creative Minds",
  "Dance Mania",
  "Vocal Legends",
  "Canvas Masters",
  "The Ultimate Performer",
  "Music Masters",
  "Artist of the Year",
  "Stage Warriors",
  "The Creative Cup",
  "Rising Stars",
  "Talent Titans",
  "The Art Arena",
  "Melody Masters",
  "Performance Pro",
];

const competitionTypes = [
  "Dance",
  "Music",
  "Vocals",
  "Art",
  "Multi Win",
  "Other",
];

const professions = [
  "Professional Choreographer",
  "Music Director",
  "Classical Dance Instructor",
  "Professional Singer",
  "Art Director",
  "Music Producer",
  "Fine Arts Professor",
  "Performance Artist",
  "Vocal Coach",
  "Creative Director",
];

const judgeNames = [
  "Raj Sharma",
  "Priya Mehta",
  "Arjun Kapoor",
  "Ananya Singh",
  "Rohan Verma",
  "Sneha Gupta",
  "Amit Malhotra",
  "Neha Sharma",
  "Vikram Joshi",
  "Kavya Rao",
  "Aditya Mehra",
  "Simran Kaur",
  "Rahul Bansal",
  "Isha Patel",
  "Karan Shah",
];

const experiencePool = [
  "5 years of professional experience",
  "8 years of experience in national competitions",
  "10 years of experience in the entertainment industry",
  "12 years of experience as a professional performer",
  "15 years of experience in competitive events",
  "7 years of experience in teaching and judging",
  "18 years of experience in the creative industry",
  "6 years of experience in professional competitions",
];

const aboutPool = [
  "A prestigious competition designed to discover and celebrate emerging talent from across the country.",
  "Participants will compete against talented individuals while showcasing their creativity and skills.",
  "An exciting platform for performers and artists to demonstrate their abilities and compete for exciting rewards.",
  "This competition brings together talented individuals from different backgrounds in a celebration of creativity.",
  "A challenging and exciting competition where participants can prove their skills and gain recognition.",
];

const eligibilityPool = [
  "Participants must be at least 16 years old",
  "Participants must register before the deadline",
  "Only original work is accepted",
  "Participants must follow the competition rules",
  "Participants must submit their entry within the submission period",
];

const rulesPool = [
  "Entries must be submitted before the deadline",
  "Participants must follow the judging guidelines",
  "Any form of plagiarism will result in disqualification",
  "The judges' decision will be final",
  "Participants must provide accurate registration information",
  "Late submissions will not be accepted",
];

const judgingParameterPool = [
  "Creativity",
  "Technical Skill",
  "Originality",
  "Presentation",
  "Performance",
  "Stage Presence",
  "Execution",
  "Overall Impact",
];

// -------------------------
// Helper functions
// -------------------------

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysFromNowMin, daysFromNowMax) {
  const date = new Date();

  const days = randomNumber(daysFromNowMin, daysFromNowMax);

  date.setDate(date.getDate() + days);

  return date;
}

function randomUniqueItems(array, min, max) {
  const copy = [...array];

  const count = randomNumber(min, Math.min(max, copy.length));

  const result = [];

  while (result.length < count) {
    const index = Math.floor(Math.random() * copy.length);

    result.push(copy.splice(index, 1)[0]);
  }

  return result;
}

// -------------------------
// Generate Judges
// -------------------------

function generateJudges() {
  const numberOfJudges = randomNumber(2, 4);

  const judges = [];

  for (let i = 0; i < numberOfJudges; i++) {
    judges.push({
      name: randomItem(judgeNames),
      profession: randomItem(professions),
      experience: randomItem(experiencePool),
    });
  }

  return judges;
}

// -------------------------
// Generate Judging Parameters
// -------------------------

function generateJudgingParameters() {
  const parameters = randomUniqueItems(
    judgingParameterPool,
    3,
    5
  );

  // Start with random positive weights
  const rawWeights = parameters.map(() =>
    Math.random() + 0.1
  );

  const total = rawWeights.reduce(
    (sum, value) => sum + value,
    0
  );

  // Convert them into percentages
  let weights = rawWeights.map((value) =>
    Math.round((value / total) * 100)
  );

  // Fix rounding so total is exactly 100
  let difference =
    100 - weights.reduce((sum, value) => sum + value, 0);

  let index = 0;

  while (difference !== 0) {
    if (difference > 0) {
      weights[index]++;
      difference--;
    } else if (weights[index] > 1) {
      weights[index]--;
      difference++;
    }

    index = (index + 1) % weights.length;
  }

  return parameters.map((parameter, index) => ({
    parameter,
    weight: weights[index],
  }));
}

// -------------------------
// Generate Rewards
// -------------------------

function generateRewards(prizePool) {
  const first = Math.floor(prizePool * 0.5);
  const second = Math.floor(prizePool * 0.25);
  const third = Math.floor(prizePool * 0.12);

  const rewards = [
    {
      position: "1st",
      prizeMoney: first,
    },
    {
      position: "2nd",
      prizeMoney: second,
    },
    {
      position: "3rd",
      prizeMoney: third,
    },
  ];

  // Sometimes add 4th-6th positions
  if (Math.random() > 0.5) {
    rewards.push({
      position: "4th",
      prizeMoney: Math.floor(prizePool * 0.06),
    });
  }

  if (Math.random() > 0.7) {
    rewards.push({
      position: "5th",
      prizeMoney: Math.floor(prizePool * 0.04),
    });
  }

  if (Math.random() > 0.8) {
    rewards.push({
      position: "6th",
      prizeMoney: Math.floor(prizePool * 0.03),
    });
  }

  return rewards;
}

// -------------------------
// Generate Winners
// -------------------------

function generatePreviousWinners() {
  const winners = [
    {
      name: randomItem(judgeNames),
      position: "1st",
    },
    {
      name: randomItem(judgeNames),
      position: "2nd",
    },
    {
      name: randomItem(judgeNames),
      position: "3rd",
    },
  ];

  return winners;
}

// -------------------------
// Generate Competition
// -------------------------

function generateCompetition(index) {
  const totalSlots = randomNumber(50, 500);

  const bookedSlots = randomNumber(
    0,
    totalSlots
  );

  const prizePool = randomItem([
    10000,
    25000,
    50000,
    75000,
    100000,
    150000,
    250000,
    500000,
  ]);

  const registrationDeadline = randomDate(5, 60);

  const submissionStarts = new Date(
    registrationDeadline
  );

  submissionStarts.setDate(
    submissionStarts.getDate() + 2
  );

  const submissionEnds = new Date(
    submissionStarts
  );

  submissionEnds.setDate(
    submissionEnds.getDate() + randomNumber(5, 15)
  );

  const resultDate = new Date(
    submissionEnds
  );

  resultDate.setDate(
    resultDate.getDate() + randomNumber(3, 10)
  );

  return {
    competitionName: `${randomItem(
      competitionNames
    )} ${index + 1}`,

    judges: generateJudges(),

    competitionType: randomUniqueItems(
      competitionTypes,
      1,
      2
    ),

    prizePool,

    entryFee: randomItem([
      0,
      100,
      200,
      300,
      500,
      750,
      1000,
      1500,
    ]),

    totalSlots,

    bookedSlots,

    registrationDeadline,

    previousWinners:
      generatePreviousWinners(),

    submissionStarts,

    submissionEnds,

    resultDate,

    rewards:
      generateRewards(prizePool),

    aboutCompetition:
      randomItem(aboutPool),

    judgingParameters:
      generateJudgingParameters(),

    eligibility:
      randomUniqueItems(
        eligibilityPool,
        2,
        4
      ),

    rules:
      randomUniqueItems(
        rulesPool,
        3,
        5
      ),
  };
}

// -------------------------
// Seed Database
// -------------------------

async function seedDatabase() {
  try {
    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in .env"
      );
    }

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // Delete existing competitions
    await Competition.deleteMany({});

    console.log(
      "Existing competitions deleted"
    );

    // Generate 100 competitions
    const competitions = [];

    for (let i = 0; i < 100; i++) {
      competitions.push(
        generateCompetition(i)
      );
    }

    // Insert all competitions
    await Competition.insertMany(
      competitions
    );

    console.log(
      "100 competitions successfully inserted!"
    );

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error(
      "Error while seeding database:",
      error
    );

    await mongoose.connection.close();

    process.exit(1);
  }
}

seedDatabase();