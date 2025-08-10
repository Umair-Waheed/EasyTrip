import multer from "multer"
import path from "path"
import fs from "fs";



//set storage
const storage=multer.diskStorage({
    destination:"../../uploads",
    filename: (req,file,cb)=>{
        cb(null,file.fieldname + "-"+ Date.now()+path.extname(file.originalname));
    }
});

//setup upload
const upload=multer({
    storage:storage,
    limits:{fileSize:5000000}, //size to 5MB
    fileFilter:(req,file,cb)=>{
        checkFileType(file,cb);
    },
}).array('images',5); // limit to 5 images

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
  
   export {upload};