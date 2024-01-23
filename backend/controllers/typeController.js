const Type = require('../models/type');

module.exports = {
    getTypes: async (req, res) => {
        try {
            const types = await Type.find();
            res.json(types);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching types');
        }
    }
}
