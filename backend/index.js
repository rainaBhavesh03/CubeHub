const port = 4001;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// connecting to the database
mongoose.connect('mongodb://127.0.0.1:27017/test');


// Import models
const Product = require("./models/product.js");
const Category = require("./models/category.js");
const Type = require("./models/type.js");



// API creation

app.get("/", (req, res) => {
    res.send("Express app is running");
})

// Image storage engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})


// Creating upload endpoint for images
app.use('/images', express.static('upload/images'))

app.post('/upload', upload.single('images'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});


//Category.create(
  //  {name: "Speed Cube" },
    //{name: "Magnetic"},
   // {name: "Budget"},
    //{name: "Premium"},
    //{name: "Miscellaneous"},
//);


app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching categories');
    }
});


//Type.create(
 //   {name: "2x2"},
 //   {name: "3x3"},
 //   {name: "4x4"},
  //  {name: "5x5"},
  //  {name: "6x6"},
//);

app.get('/types', async (req, res) => {
    try {
        const types = await Type.find();
        res.json(types);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching types');
    }
});


// API for adding products

app.post('/addproduct', upload.single('images'), async (req, res) => {
    try {
        const categories = JSON.parse(req.body.categories);
        const types = JSON.parse(req.body.types);

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
            type:types.map(typeId => new mongoose.Types.ObjectId(typeId)),
            brand:req.body.brand,
            description:req.body.description,
            images:req.body.images,
            category:categories.map(categoryId => new mongoose.Types.ObjectId(categoryId)),
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
});


// API for deleting products

app.post('/removeproduct', async (req, res) => {
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
});

// API to edit a specific product

app.put('/editproduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
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
});


// Creating API for getting all products

app.get('/allproducts', async (req, res) => {
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
})

app.get('/productdetail/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        const productDetail = await Product.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(productId)
                }
            },
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

        if (productDetail.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(productDetail[0]); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// API for sorting and filtering the products

app.get("/products", async (req, res) => {
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
});


app.listen(port, (error) => {
    if(!error) {
        console.log("Server running on port: "+port);
    }
    else {
        console.log("Error : "+error);
    }
})
