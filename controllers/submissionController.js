const express = require("express");
const Submission = require("../schema/submissionModel");
const Quiz = require("../schema/quizModel");

exports.submitQuiz = async (req, res) => {
  const { quizId, userId, responses } = req.body;

  // const quizId = "66e6b0817000b23949547a49";
  // const userId = "66e68241c31ca3cb75c87fa5";
  // const responses = [
  //   {
  //     questionId: "66e6b0817000b23949547a4a",
  //     userResponse: "$400",
  //   },
  //   {
  //     questionId: "66e6b0817000b23949547a4b",
  //     userResponse: "100 meters^2",
  //   },
  //   {
  //     questionId: "66e6b0817000b23949547a4c",
  //     userResponse: "900 liters",
  //   },
  //   {
  //     questionId: "66e6b0817000b23949547a4e",
  //     userResponse: "70 miles",
  //   },
  //   {
  //     questionId: "66e6b0817000b23949547a4f",
  //     userResponse: "72 degrees",
  //   },

  //   {
  //     questionId: "66e6b0817000b23949547a50",
  //     userResponse: "40 books",
  //   },
  //   {
  //     questionId: "66e6b0817000b23949547a51",
  //     userResponse: "160 tickets",
  //   },
  //   {
  //     questionId: "66e6b0817000b23949547a52",
  //     userResponse: "$500",
  //   },
  //   {
  //     questionId: "66e6b0817000b23949547a53",
  //     userResponse: "72 degrees",
  //   },
  //   {
  //     questionId: "66e6b0817000b23949547a4f",
  //     userResponse: "8 meters",
  //   },
  // ];

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    let score = 0;
    const processedResponses = responses.map((response) => {
      const question = quiz.questions.id(response.questionId);
      if (!question) {
        throw new Error(`Question with id ${response.questionId} not found`);
      }
      const isCorrect = response.userResponse === question.correctAnswer;
      if (isCorrect) {
        score += 1;
      }

      return {
        questionId: response.questionId,
        userResponse: response.userResponse,
        correct: isCorrect,
      };
    });
    const totalQuestions = quiz.questions.length;
    const percentageScore = (score / totalQuestions) * 100;

    let submission = await Submission.findOne({ quizId, userId });

    if (!submission) {
      submission = new Submission({ quizId, userId, attempts: [] });
    }

    submission.attempts.push({
      responses: processedResponses,
      score: percentageScore.toString() + "%",
    });

    const savedSubmission = await submission.save();

    res.status(200).json({
      message: "Quiz submission saved successfully",
      submission: savedSubmission,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSubmissions = async (req, res) => {
  // const quizId = "66e6b0817000b23949547a49";
  // const userId = "66e68241c31ca3cb75c87fa5";
  const { quizId, userId } = req.body;

  try {
    const submission = await Submission.findOne({ quizId, userId });
    if (!submission) {
      return res
        .status(404)
        .json({ message: "No submission found for this quiz" });
    }

    res.status(200).json({
      message: "Submission history retrieved successfully",
      attempts: submission.attempts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
