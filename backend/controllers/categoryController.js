const Category = require('../models/category');

module.exports = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            res.json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching categories');
        }
    }
}
