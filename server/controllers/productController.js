import { Product } from '../models/Product.js';

/**
 * @desc    Get all products
 * @route   GET /api/products
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    if (page && limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
      const total = await Product.countDocuments();
      const products = await Product.find()
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);
      return res.status(200).json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
    }
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or upsert a product
 * @route   POST /api/products
 */
export const upsertProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    if (!productData || !productData.id) {
      return res.status(400).json({ error: 'Product id is required' });
    }

    const product = await Product.findOneAndUpdate(
      { id: productData.id },
      { $set: productData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single product by id or slug
 * @route   GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      $or: [{ id }, { slug: id }]
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found', id });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product by id
 * @route   DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found', id });
    }
    res.status(200).json({ message: 'Product deleted successfully', id });
  } catch (error) {
    next(error);
  }
};
