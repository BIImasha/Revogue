const Item = require("../models/Item");

// ─── UPLOAD ITEM ──────────────────────────────────────────
// POST /api/items
const uploadItem = async (req, res) => {
  const { title, description, category, condition, size } = req.body;

  try {
    // Get uploaded image paths
    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const item = await Item.create({
      owner: req.user._id,
      title,
      description,
      category,
      condition,
      size,
      images
    });

    res.status(201).json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL ITEMS ────────────────────────────────────────
// GET /api/items
const getAllItems = async (req, res) => {
  try {
    const { category, search } = req.query;

    // Build filter
    const filter = { status: "available" };

    // Filter by category if provided
    if (category) filter.category = category;

    // Search by title if provided
    // $regex allows partial matching
    // $options: "i" means case-insensitive
    // So "jacket" matches "Jacket", "JACKET", "Blue Jacket" etc.
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const items = await Item.find(filter)
      .populate("owner", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET MY ITEMS (Wardrobe) ──────────────────────────────
// GET /api/items/myitems
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE ITEM ──────────────────────────────────────────
// DELETE /api/items/:id
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Only the owner can delete their item
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE ITEM ──────────────────────────────────────────
// PUT /api/items/:id
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { title, description, category, condition, size } = req.body;

    item.title       = title       || item.title;
    item.description = description || item.description;
    item.category    = category    || item.category;
    item.condition   = condition   || item.condition;
    item.size        = size        || item.size;

    const updated = await item.save();
    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadItem,
  getAllItems,
  getMyItems,
  deleteItem,
  updateItem
};