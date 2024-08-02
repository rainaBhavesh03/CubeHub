require('dotenv').config();

const port = 4001;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// Connecting to the database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({storage: storage});

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('images'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const typeRoutes = require('./routes/typeRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Use routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/types', typeRoutes);
app.use('/cart', cartRoutes);
app.use('/review', reviewRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Express app is running");
});

// Start server
app.listen(port, (error) => {
    if(!error) {
        console.log("Server running on port: "+port);
    } else {
        console.log("Error : "+error);
    }
});
