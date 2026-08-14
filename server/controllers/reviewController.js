import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide rating and comment",
      });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString(),
    );
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const hasPurchased = await Order.findOne({
      user: req.user._id,
      "orderItems.product": productId,
      isPaid: true,
      isDelivered: true,
    });
    if (!hasPurchased) {
      return res.status(400).json({
        success: false,
        message: "You must purchase this product to review it",
      });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: Date.now(),
    });
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: product.reviews[product.reviews.length - 1],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error adding review",
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      count: product.reviews.length,
      data: product.reviews,
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error fetching product reviews",
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = product.reviews.findIndex(
      (review) => review._id.toString() === reviewId,
    );
    if (review === -1) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    product.reviews.splice(review, 1);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => acc + item.rating, 0) /
          product.reviews.length
        : 0;
    await product.save();
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error deleting review",
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({
      "reviews.0": { $exists: true },
    }).select("name reviews");

    const reviews = products.flatMap((product) =>
      product.reviews.map((review) => ({
        ...review.toObject(),
        productId: product._id,
        productName: product.name,
      })),
    );

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error fetching reviews",
    });
  }
};
