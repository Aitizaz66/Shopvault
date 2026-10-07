import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { httpError } from "../utils/httpError.js";

const paidOrders = { isPaid: true, status: { $ne: "Cancelled" } };
const dailySales = () => Order.aggregate([
  { $match: { ...paidOrders, paidAt: { $gte: new Date(Date.now() - 30 * 86400000) } } },
  { $group: { _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" }, day: { $dayOfMonth: "$paidAt" } }, total: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
  { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
]);

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      { $match: paidOrders },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const recentOrders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const topProducts = await Order.aggregate([
      { $match: paidOrders },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          image: { $first: "$orderItems.image" },
          totalSold: { $sum: "$orderItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
        topProducts,
        ordersByStatus,
        dailySales: await dailySales(),
      },
    });
  } catch (error) { throw error; }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) { throw error; }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) { throw error; }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, isAdmin } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim() || name.length > 100) throw httpError(400, "Enter a valid name");
      user.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw httpError(400, "Enter a valid email");
      user.email = email.trim().toLowerCase();
    }

    if (isAdmin !== undefined) {
      if (typeof isAdmin !== "boolean") throw httpError(400, "Invalid admin role");
      if (!isAdmin && user._id.equals(req.user._id)) throw httpError(400, "You cannot remove your own admin access");
      user.isAdmin = isAdmin;
    }
    const existingUser = await User.findOne({
      email: user.email,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }
    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) { throw error; }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete yourself",
      });
    }
    if (await Order.exists({ user: user._id })) throw httpError(409, "This user has orders and cannot be deleted. Their order history must be retained.");
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) { throw error; }
};

export const getSalesReport = async (req, res) => {
  const [days, revenue, count] = await Promise.all([dailySales(), Order.aggregate([{ $match: paidOrders }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]), Order.countDocuments(paidOrders)]);
  res.json({ success: true, data: { dailySales: days, totalRevenue: revenue[0]?.total || 0, totalOrders: count } });
};
