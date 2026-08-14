import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const filter = { ...keyword, ...category };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error fetching products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error fetching product by id",
    });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error fetching product by slug",
    });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).sort(
      { createdAt: -1 },
    );
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error fetching product by category",
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    // Returns an array of unique category strings
    const categories = await Product.distinct("category");
    if (!categories) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error fetching categories",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, images, stock } =
      req.body;
    if (
      !name ||
      !description ||
      price === undefined ||
      price === null ||
      !category ||
      !image ||
      stock === undefined ||
      stock === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const slug = name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-");

    const productExists = await Product.findOne({ slug });
    if (productExists) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      category,
      image,
      images: images || [],
      stock,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error creating product",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update name
    if (req.body.name !== undefined) {
      const newName = req.body.name.trim();

      // Update slug only when name is actually changed
      if (newName !== product.name) {
        product.slug = newName
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
      }

      product.name = newName;
    }

    // Update description
    if (req.body.description !== undefined) {
      product.description = req.body.description;
    }

    // Update price
    if (req.body.price !== undefined) {
      product.price = req.body.price;
    }

    // Update category
    if (req.body.category !== undefined) {
      product.category = req.body.category;
    }

    // Update main image
    if (req.body.image !== undefined) {
      product.image = req.body.image;
    }

    // Update additional images
    if (req.body.images !== undefined) {
      product.images = req.body.images;
    }

    // Update stock
    if (req.body.stock !== undefined) {
      product.stock = req.body.stock;
    }

    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error updating product",
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error deleting product",
    });
  }
};
