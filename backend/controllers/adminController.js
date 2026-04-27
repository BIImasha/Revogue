const User     = require("../models/User");
const Item     = require("../models/Item");
const Swap     = require("../models/Swap");
const Feedback = require("../models/Feedback");

// ─── GET DASHBOARD STATS ──────────────────────────────────
// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalItems,
      totalSwaps,
      totalFeedbacks,
      pendingSwaps,
      acceptedSwaps,
      availableItems,
      swappedItems
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Swap.countDocuments(),
      Feedback.countDocuments(),
      Swap.countDocuments({ status: "pending"  }),
      Swap.countDocuments({ status: "accepted" }),
      Item.countDocuments({ status: "available" }),
      Item.countDocuments({ status: "swapped"  })
    ]);

    res.json({
      totalUsers,
      totalItems,
      totalSwaps,
      totalFeedbacks,
      pendingSwaps,
      acceptedSwaps,
      availableItems,
      swappedItems
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL USERS ────────────────────────────────────────
// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE USER ──────────────────────────────────────────
// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own admin account!"
      });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL ITEMS ────────────────────────────────────────
// GET /api/admin/items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(items);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE ITEM ──────────────────────────────────────────
// DELETE /api/admin/items/:id
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL SWAPS ────────────────────────────────────────
// GET /api/admin/swaps
const getAllSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find()
      .populate("requester",     "name email")
      .populate("receiver",      "name email")
      .populate("requestedItem", "title")
      .populate("offeredItem",   "title")
      .sort({ createdAt: -1 });

    res.json(swaps);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET SUSTAINABILITY DATA ──────────────────────────────
// GET /api/admin/sustainability/public
const getSustainabilityData = async (req, res) => {
  try {
    // Get all accepted swaps with item and user details
    const acceptedSwaps = await Swap.find({ status: "accepted" })
      .populate("requestedItem", "title category")
      .populate("offeredItem",   "title category")
      .populate("requester",     "name email")
      .populate("receiver",      "name email");

    // ── CO₂ / WATER / MONEY VALUES PER CATEGORY ──────────
    const impactValues = {
      "Women's Clothing":          { co2: 2.1,  water: 2700, money: 25 },
      "Men's Clothing":            { co2: 2.0,  water: 2500, money: 22 },
      "Kids' Clothing":            { co2: 1.2,  water: 1500, money: 15 },
      "Footwear":                  { co2: 2.5,  water: 1500, money: 30 },
      "Accessories":               { co2: 0.8,  water: 500,  money: 15 },
      "Jewelry":                   { co2: 0.5,  water: 200,  money: 20 },
      "Outerwear & Seasonal Wear": { co2: 3.5,  water: 3500, money: 40 },
      "Bags & Carry Items":        { co2: 2.0,  water: 1200, money: 25 },
    };

    // ── PLATFORM TOTALS ───────────────────────────────────
    let totalCO2   = 0;
    let totalWater = 0;
    let totalMoney = 0;

    // ── CATEGORY BREAKDOWN ────────────────────────────────
    const categoryBreakdown = {};

    // ── PER-USER STATS MAP ────────────────────────────────
    const userMap = {};

    const initUser = (id) => {
      if (!userMap[id]) {
        userMap[id] = { swapCount: 0, itemsReused: 0, co2: 0, water: 0, money: 0 };
      }
    };

    const addUserImpact = (userId, co2, water, money) => {
      const id = userId.toString();
      initUser(id);
      userMap[id].co2   += co2;
      userMap[id].water += water;
      userMap[id].money += money;
    };

    acceptedSwaps.forEach((swap) => {

      // ── COUNT SWAPS & ITEMS REUSED PER USER ──
      // Each user reuses only THEIR OWN 1 item per swap
      if (swap.requester) {
        const id = swap.requester._id.toString();
        initUser(id);
        userMap[id].swapCount   += 1;
        userMap[id].itemsReused += 1; // ✅ Only 1 item per user per swap
      }
      if (swap.receiver) {
        const id = swap.receiver._id.toString();
        initUser(id);
        userMap[id].swapCount   += 1;
        userMap[id].itemsReused += 1; // ✅ Only 1 item per user per swap
      }

      // ── TRACK IMPACT PER ITEM ──
      [swap.requestedItem, swap.offeredItem].forEach((item) => {
        if (!item) return;

        const cat    = item.category || "Other";
        const values = impactValues[cat] || { co2: 1.0, water: 1000, money: 10 };

        // Platform totals
        totalCO2   += values.co2;
        totalWater += values.water;
        totalMoney += values.money;

        // Category breakdown
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = { count: 0, co2: 0, water: 0, money: 0 };
        }
        categoryBreakdown[cat].count += 1;
        categoryBreakdown[cat].co2   += values.co2;
        categoryBreakdown[cat].water += values.water;
        categoryBreakdown[cat].money += values.money;

        // Per-user impact split between requester and receiver
        if (swap.requester) addUserImpact(swap.requester._id, values.co2 / 2, values.water / 2, values.money / 2);
        if (swap.receiver)  addUserImpact(swap.receiver._id,  values.co2 / 2, values.water / 2, values.money / 2);
      });
    });

    // ── ENSURE ALL 8 CATEGORIES ALWAYS PRESENT ───────────
    const ALL_CATEGORIES = [
      "Women's Clothing",
      "Men's Clothing",
      "Kids' Clothing",
      "Footwear",
      "Accessories",
      "Jewelry",
      "Outerwear & Seasonal Wear",
      "Bags & Carry Items"
    ];

    const completeCategoryBreakdown = ALL_CATEGORIES.map((cat) => {
      const existing = categoryBreakdown[cat];
      if (existing) {
        return {
          category:    cat,
          itemsReused: existing.count,
          co2Saved:    Math.round(existing.co2   * 10) / 10,
          waterSaved:  Math.round(existing.water),
          moneySaved:  Math.round(existing.money)
        };
      }
      return {
        category:    cat,
        itemsReused: 0,
        co2Saved:    0,
        waterSaved:  0,
        moneySaved:  0
      };
    });

    // ── MONTHLY TREND ─────────────────────────────────────
    const monthlyMap = {};
    acceptedSwaps.forEach((swap) => {
      const month = new Date(swap.updatedAt).toLocaleString("en-GB", {
        month: "short", year: "numeric"
      });
      if (!monthlyMap[month]) {
        monthlyMap[month] = { month, swaps: 0, itemsReused: 0, co2: 0, water: 0, money: 0 };
      }
      monthlyMap[month].swaps       += 1;
      monthlyMap[month].itemsReused += 2;
    });

    // ── USER STATS ────────────────────────────────────────
    const userIds  = Object.keys(userMap);
    const userDocs = await User.find({ _id: { $in: userIds } }).select("name email");

    const userStats = userDocs.map((u) => {
      const stats = userMap[u._id.toString()] || {};
      return {
        userId:      u._id,
        name:        u.name,
        email:       u.email,
        swapCount:   stats.swapCount   || 0,
        itemsReused: stats.itemsReused || 0, // ✅ Per-user correct count
        co2Saved:    Math.round((stats.co2   || 0) * 10) / 10,
        waterSaved:  Math.round(stats.water  || 0),
        moneySaved:  Math.round(stats.money  || 0),
      };
    });

    // ── FORMAT RESPONSE ───────────────────────────────────
    res.json({
      summary: {
        totalSwaps:       acceptedSwaps.length,
        totalCO2Saved:    Math.round(totalCO2   * 10) / 10,
        totalWaterSaved:  Math.round(totalWater),
        totalMoneySaved:  Math.round(totalMoney),
        totalItemsReused: acceptedSwaps.length * 2  // Platform total = swaps × 2
      },
      categoryBreakdown: completeCategoryBreakdown,
      monthlyTrend:      Object.values(monthlyMap),
      userStats,
      sources: [
        "Niinimäki et al. (2020) — Nature Reviews Earth & Environment",
        "United Nations Environment Programme (UNEP)",
        "Ellen MacArthur Foundation (2017)",
        "ThredUp Annual Resale Report (2023)"
      ]
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── EXPORTS ──────────────────────────────────────────────
module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllItems,
  deleteItem,
  getAllSwaps,
  getSustainabilityData
};