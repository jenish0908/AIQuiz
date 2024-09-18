const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Submission = require("../schema/submissionModel");
const Quiz = require("../schema/quizModel");

exports.filter = async (req, res) => {
  // const userId = "66e68241c31ca3cb75c87fa5";
  const { userId, grade, subject, minScore, from, to } = req.query;
  try {
    const minScoreNumeric = minScore
      ? parseFloat(minScore.replace("%", ""))
      : null;
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    const filteredSubmissions = await Submission.aggregate([
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "quizDetails",
        },
      },
      {
        $unwind: "$quizDetails",
      },
      {
        $unwind: "$attempts",
      },
      {
        $addFields: {
          "attempts.numericScore": {
            $toDouble: {
              $substr: [
                "$attempts.score",
                0,
                { $subtract: [{ $strLenCP: "$attempts.score" }, 1] },
              ],
            },
          },
        },
      },
      {
        $match: {
          ...(userId ? { userId: new mongoose.Types.ObjectId(userId) } : {}),
          ...(grade ? { "quizDetails.gradeLevel": grade } : {}),
          ...(subject ? { "quizDetails.subject": subject } : {}),
          ...(minScoreNumeric !== null
            ? { "attempts.numericScore": { $gte: minScoreNumeric } }
            : {}),
          ...(fromDate || toDate
            ? {
                "attempts.submittedAt": {
                  ...(fromDate ? { $gte: fromDate } : {}),
                  ...(toDate ? { $lte: toDate } : {}),
                },
              }
            : {}),
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          quizId: 1,
          "quizDetails.title": 1,
          "quizDetails.subject": 1,
          "quizDetails.gradeLevel": 1,
          attempts: 1,
        },
      },
    ]);

    res.json({ filteredSubmissions });
  } catch (err) {
    console.error("Error retrieving submissions:", err);
    throw err;
  }
};

exports.filterQuizHistory = async (req, res) => {
  const { grade, subject, minScore, completedAfter } = req.query;
  try {
    const submissions = await Submission.aggregate([
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "quizDetails",
        },
      },
      {
        $unwind: "$quizDetails",
      },
      {
        $match: {
          ...(grade ? { "quizDetails.gradeLevel": grade } : {}),
          ...(subject ? { "quizDetails.subject": subject } : {}),
          ...(minScore ? { "attempts.score": { $gte: minScore } } : {}),
          ...(completedAfter
            ? { "attempts.submittedAt": { $gte: new Date(completedAfter) } }
            : {}),
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          quizId: 1,
          "quizDetails.title": 1,
          "quizDetails.subject": 1,
          "quizDetails.gradeLevel": 1,
          attempts: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "User quiz history filtered successfully.",
      data: submissions,
    });
  } catch (err) {
    console.error("Error filtering submissions:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.filterByScore = async (req, res) => {
  const userId = "66e68241c31ca3cb75c87fa5";
  const { minScore, maxScore } = req.query;

  try {
    let filter = { userId };

    if (minScore || maxScore) {
      filter["attempts"] = {
        $elemMatch: {
          score: {
            ...(minScore && { $gte: `${minScore}%` }),
            ...(maxScore && { $lte: `${maxScore}%` }),
          },
        },
      };
    }

    const submissions = await Submission.find(filter).populate("quizId");

    if (!submissions.length) {
      return res.status(404).json({
        message:
          "No quiz history found for this user with the provided score filter.",
      });
    }

    const filteredSubmissions = submissions
      .map((submission) => {
        // Filter only attempts with scores within the specified range
        const filteredAttempts = submission.attempts.filter((attempt) => {
          const attemptScore = parseInt(attempt.score.replace("%", ""), 10);
          const min = minScore ? parseInt(minScore, 10) : 0;
          const max = maxScore ? parseInt(maxScore, 10) : 100;
          return attemptScore >= min && attemptScore <= max;
        });

        // Return only the submission if it has matching attempts
        return filteredAttempts.length
          ? { ...submission.toObject(), attempts: filteredAttempts }
          : null;
      })
      .filter(Boolean);

    res.status(200).json({
      message: "User quiz history filtered by score retrieved successfully.",
      data: filteredSubmissions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
