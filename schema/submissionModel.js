const mongoose = require("mongoose");

// Define the schema for user quiz submissions
const submissionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attempts: [
    {
      responses: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          userResponse: {
            type: String,
            required: true,
          },
          correct: {
            type: Boolean,
            default: false,
          },
        },
      ],
      score: {
        type: String,
        required: true,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Create the model based on the schema
const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
