const { default: mongoose } = require('mongoose');
const Product = require('../models/product');

module.exports = {
    addProduct: async (req, res) => {
        try {
            const categories = req.body.categories.map(categoryId => new mongoose.Types.ObjectId(categoryId));
            const types = req.body.types.map(typeId => new mongoose.Types.ObjectId(typeId));


            let products = await Product.find({});
            let id;
            if(products.length>0){
                let last_product_array = products.slice(-1);
                let last_product = last_product_array[0];
                id = last_product.id+1;
            }
            else{
                id = 1;
            }

            const product = new Product({
                id:id,
                name:req.body.name,
                type:types,
                brand:req.body.brand,
                description:req.body.description,
                images:req.body.images,
                category:categories,
                new_price:req.body.new_price,
                old_price:req.body.old_price,
                stockQuantity:req.body.stockQuantity,
            });
            console.log(product);
            await product.save();
            console.log('saved');
            res.json({
                success:true,
                name:req.body.name
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create product' });
        }
    },

    removeProduct: async (req, res) => {
        try {
            const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });

            if (!deletedProduct) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found',
                });
            }

            console.log('Product removed:', deletedProduct.name);
            res.json({
                success: true,
                name: deletedProduct.name,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to remove product' });
        }
    },

    editProduct: async (req, res) => {
        try {
            const productId = req.params.id;

            const updatedProduct = await Product.findOneAndUpdate(
                { id: productId },
                req.body,
                { new: true } // Return the updated product
            );

            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({
                success: true,
                message: 'Product updated successfully',
                product: updatedProduct,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update product' });
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const products = await Product.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        let: { categoryIds: "$category" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$_id", "$$categoryIds"] } } }
                        ],
                        as: "category"
                    }
                },
                {
                    $lookup: {
                        from: "types",
                        let: { typeIds: "$type" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$_id", "$$typeIds"] } } }
                        ],
                        as: "type"
                    }
                },
                {
                    $addFields: {
                        category: {
                            $map: {
                                input: "$category",
                                as: "category",
                                in: "$$category.name"
                            }
                        },
                        type: {
                            $map: {
                                input: "$type",
                                as: "type",
                                in: "$$type.name"
                            }
                        }
                    }
                }
            ]);

            res.json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch all products' });
        }
    },

    productDetail: async (req, res) => {
        try {
            const productId = req.params.productId;

            const productDetail = await Product.aggregate([
                {
                    $match: {
                        id: parseInt(productId)
                    }
                },
                {
                    $project: {
                        _id: 0, 
                    }
                }
            ]);

            if (productDetail.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(productDetail[0]); 
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    productSearch: async (req, res) => {
        try {
            const searchTerm = req.query.term;

            const results = await Product.aggregate([
                {
                    $lookup: {
                        from: "types",
                        localField: "name",
                        foreignField: "_id",
                        as: "typeDetails"
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "name",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },
                {
                    $match: {
                        $or: [
                            { name: { $regex: searchTerm, $options: 'i' } },
                            { brand: { $regex: searchTerm, $options: 'i' } },
                            { 'typeDetails.name': { $regex: searchTerm, $options: 'i' } },
                            { 'categoryDetails.name': { $regex: searchTerm, $options: 'i' } },
                            { description: { $regex: searchTerm, $options: 'i' } },
                        ],
                    },
                },
            ]);

            res.status(200).json(results);
        } catch (error) {
            console.error('Error searching products:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    productSort: async (req, res) => {
        try {
            let products = await Product.find();

            // Apply filtering based on query parameters
            if (req.query.category) {
                products = products.find({ category: req.query.category });
            }
            if (req.query.type) {
                products = products.find({ type: req.query.type });
            }
            if (req.query.brand) {
                products = products.find({ brand: req.query.brand });
            }

            // Apply sorting based on query parameters
            if (req.query.sortBy === "name") {
                products = products.sort({ name: req.query.sortOrder === "asc" ? 1 : -1 });
            } else if (req.query.sortBy === "price") {
                products = products.sort({ new_price: req.query.sortOrder === "asc" ? 1 : -1 });
            }

            res.send(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch products" });
        }
    }
}
