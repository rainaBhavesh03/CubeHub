const { default: mongoose } = require('mongoose');
const Product = require('../models/product');

module.exports = {
    addProduct: async (req, res) => {
        try {
            const categories = req.body.categories.map(categoryId => new mongoose.Types.ObjectId(categoryId));
            const types = req.body.types.map(typeId => new mongoose.Types.ObjectId(typeId));

            if(req.body.stockQuantity < 0)
                req.body.stockQuantity = 0;
            const product = new Product({
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
            const deletedProduct = await Product.findOneAndDelete({ _id: req.body.id });

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

            if(req.body.stockQuantity < 0)
                req.body.stockQuantity = 0;
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: productId },
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

            const productDetail = await Product.findById(productId);

            if (productDetail.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(productDetail); 
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

            const categories = req.query.categories;
            const types = req.query.types;
            const rating = req.query.rating;
            const priceRange = req.query.price_range ? JSON.parse(req.query.price_range) : undefined;
            const sort = req.query.sort_by;

            let searchResults = [...results];

            // Filter by multiple categories
            if (categories && categories.length > 0) {
                searchResults = searchResults.filter(product =>
                    product.category && product.category.some(catId => categories.includes(catId))
                );
            }

            // Filter by multiple types
            if (types && types.length > 0) {
                searchResults = searchResults.filter(product =>
                    product.type && product.type.some(typeId => types.includes(typeId))
                );
            }

            // Filter by rating
            if (rating) {
                searchResults = searchResults.filter(product =>
                    product.averageRating >= parseFloat(rating)
                );
            }

            // Filter by price range
            if (priceRange && (priceRange.min || priceRange.max)) {
                searchResults = searchResults.filter(product => {
                    const price = product.new_price;
                    return (!priceRange.min || price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || price <= parseFloat(priceRange.max));
                });
            }


            switch (sort) {
                case 'price-asc':
                    searchResults.sort((a, b) => a.new_price - b.new_price);
                    break;
                case 'price-desc':
                    searchResults.sort((a, b) => b.new_price - a.new_price);
                    break;
                case 'rating':
                    searchResults.sort((a, b) => b.averageRating - a.averageRating);
                    break;
                case 'name-desc':
                    searchResults.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                default:
                    searchResults.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }



            res.status(200).json(searchResults);
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
