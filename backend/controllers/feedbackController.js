const Feedback = require("../models/Feedback");

// ─── SUBMIT FEEDBACK ──────────────────────────────────────
// POST /api/feedback
const submitFeedback = async (req, res) => {
  const { text, rating } = req.body;

  try {
    const feedback = await Feedback.create({
      user:   req.user._id,
      text,
      rating
    });

    const populated = await feedback.populate("user", "name profilePic");
    res.status(201).json(populated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL FEEDBACK ─────────────────────────────────────
// GET /api/feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(feedbacks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET MY FEEDBACKS ─────────────────────────────────────
// GET /api/feedback/myfeedbacks
const getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(feedbacks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── EDIT FEEDBACK ────────────────────────────────────────
// PUT /api/feedback/:id
const editFeedback = async (req, res) => {
  const { text, rating } = req.body;

  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Only the owner can edit their feedback
    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    feedback.text   = text   || feedback.text;
    feedback.rating = rating || feedback.rating;

    const updated = await feedback.save();
    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE FEEDBACK ──────────────────────────────────────
// DELETE /api/feedback/:id
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Only the owner can delete their feedback
    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await feedback.deleteOne();
    res.json({ message: "Feedback deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  getMyFeedbacks,
  editFeedback,
  deleteFeedback
};