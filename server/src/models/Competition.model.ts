import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    competitionName: {
      type: String,
      required: true,
      trim: true,
    },

    judges: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        profession: {
          type: String,
          required: true,
          trim: true,
        },

        experience: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    competitionType: [
      {
        type: String,
        enum: [
          "Dance",
          "Music",
          "Vocals",
          "Art",
          "Multi Win",
          "Other",
        ],
      },
    ],

    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },

    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    totalSlots: {
      type: Number,
      required: true,
      min: 1,
    },

    bookedSlots: {
      type: Number,
      default: function (): number {
        return this.totalSlots;
      },
      min: 0,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    previousWinners: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        position: {
          type: String,
          enum: ["1st", "2nd", "3rd"],
          required: true,
        },
      },
    ],

    submissionStarts: {
      type: Date,
      required: true,
    },

    submissionEnds: {
      type: Date,
      required: true,
    },

    resultDate: {
      type: Date,
      required: true,
    },

    rewards: [
      {
        position: {
          type: String,
          enum: ["1st", "2nd", "3rd", "4th", "5th", "6th"],
          required: true,
        },

        prizeMoney: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    aboutCompetition: {
      type: String,
      required: true,
      trim: true,
    },

    judgingParameters: [
      {
        parameter: {
          type: String,
          required: true,
          trim: true,
        },

        weight: {
          type: Number,
          min: 0,
          max: 100,
        },
      },
    ],

    eligibility: [
      {
        type: String,
        trim: true,
      },
    ],

    rules: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Competition = mongoose.model("Competition", competitionSchema);

export default Competition;