require('dotenv').config();

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
console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() =>
        console.log('MongoDB connected'))
    .catch(err => console.error(err));



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



//Type.create(
 //   {name: "2x2"},
 //   {name: "3x3"},
 //   {name: "4x4"},
  //  {name: "5x5"},
  //  {name: "6x6"},
//);




// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const typeRoutes = require('./routes/typeRoutes');

// Use routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/types', typeRoutes);




app.listen(port, (error) => {
    if(!error) {
        console.log("Server running on port: "+port);
    }
    else {
        console.log("Error : "+error);
    }
})
