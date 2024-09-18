const nodemailer = require("nodemailer");
const { Groq } = require("groq-sdk");
const dotenv = require("dotenv");
const QuizModel = require("../schema/quizModel");
const SubmissionModel = require("../schema/submissionModel"); // Assuming you have a model for submissions
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API });

const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

// Function to generate suggestions based on responses
const generateSuggestionsFromAI = async (responses) => {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an AI that analyzes quiz results and suggests areas for improvement based on incorrect answers.",
      },
      {
        role: "user",
        content: `Based on the following quiz responses, suggest two areas where the user can improve their skills: ${JSON.stringify(
          responses
        )}`,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.7,
    max_tokens: 150, // Adjust as needed
    top_p: 1,
    stop: null,
    stream: false,
  });

  const suggestions = response.choices[0]?.message?.content.trim();
  return suggestions;
};

// Function to send email
const sendEmail = async (email, subject, body) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: body,
  };

  return transporter.sendMail(mailOptions);
};

// Controller to send results over email
exports.sendResultsOverEmail = async (req, res) => {
  const { submissionId, email } = req.body;

  if (!submissionId || !email) {
    return res
      .status(400)
      .json({ message: "Submission ID and email are required." });
  }

  try {
    // Fetch submission and quiz details
    const submission = await SubmissionModel.findById(submissionId).populate(
      "quizId"
    );
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const quizTitle = submission.quizId.title;
    const grade = submission.quizId.gradeLevel;
    const subject = submission.quizId.subject;
    const score = submission.attempts[0].score;
    const responses = submission.attempts[0].responses; // Assuming responses are stored here

    // Generate AI suggestions for improvement
    const suggestions = await generateSuggestionsFromAI(responses);

    // Prepare email content
    const emailBody = `
      Hello,

      Here are the results for your recent quiz attempt:

      Quiz Title: ${quizTitle}
      Grade Level: ${grade}
      Subject: ${subject}
      Score: ${score}

      Based on your responses, here are two suggestions to improve your skills:
      ${suggestions}

      Keep practicing, and good luck on your next quiz!

      Best regards,
      The Quiz App Team
    `;

    // Send email with results
    await sendEmail(email, `Your Quiz Results for ${quizTitle}`, emailBody);

    res.status(200).json({ message: "Results emailed successfully." });
  } catch (error) {
    console.error("Error sending results over email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
