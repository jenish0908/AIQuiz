const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  gradeLevel: { type: Number, required: true },
  subject: { type: String, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [String],
      correctAnswer: { type: String, required: true },
      // hint: { type: String }, // Bonus feature: provide hints for questions
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
