    // const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
// const GridFsStorage = require('multer-gridfs-storage');
// const multer = require('multer');
// const path = require('path');
       
// const conn = mongoose.createConnection("mongodb+srv://kirtisri2002:kirtiAs54321@cluster0.5l7s2cy.mongodb.net/products?retryWrites=true&w=majority"); // Use your MongoDB connection URI

// let gfs;


// conn.once('open', () => {
//     // Initialize GridFS
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploads'); // 'uploads' is the name of the GridFS collection
// });

// // Create storage engine using multer-gridfs-storage
// const storage = new GridFsStorage({
//     gfs,
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     },
// });

// // Initialize multer with GridFS storage engine
// const upload = multer({ storage });

// // Define the 'File' schema
// const fileSchema = new mongoose.Schema({
//     filename: String,
//     fileId: mongoose.Schema.Types.ObjectId,
// });

// // Create and export the 'File' model using the 'fileSchema'
// module.exports = {
//     File: mongoose.model('File', fileSchema),
//     upload: upload,
// };
