const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const mongoose=require("mongoose");
const laptopinfo = require("./models/laptopinfo.js");
const enrollinfo = require("./models/stdEnroll.js");
app.use('/uploads', express.static('uploads'));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

const PDFDocument = require("pdfkit");
const fs = require("fs");

main().then((res)=>{
  console.log("connection successfull");
}).catch((err)=>{
  console.log(err);
})

async function main(){
  await mongoose.connect("mongodb://127.0.0.1:27017/mastermind");
}


const multer = require('multer');

// Configure storage (save file in 'uploads' folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // unique filename
  }
});

const upload = multer({ storage: storage });

app.get("/home",(req,res)=>{
res.render("index.ejs");
});

app.get("/home/store",async(req,res)=>{
  let  avaiLaptops= await laptopinfo.find();
   
res.render("laptop.ejs",{avaiLaptops});
});

//no need
// app.get("/home/new",(req,res)=>{
// res.render("newLaptops.ejs");
// });

app.post("/home/admin", upload.single('image'), (req, res) => {
  // req.file contains the uploaded file info
  // req.body contains other form fields
  let { details, features, price, discount } = req.body;
  let image = req.file.filename; // filename stored on server


  //store in database 
  let avaiLaptops=new laptopinfo({
    image:image,
    details:details,
    features:features,
    price:price,
    discount:discount
  })
   

avaiLaptops.save().then(res=>{console.log("laptop info was saved")}).catch(err=>{console.log(err)});

  // avaiLaptops.push({ image, details, features, price, discount });
  
  res.redirect("/home/store");
});
//admin route
app.get("/home/admin",async(req,res)=>{
   let  avaiLaptops= await laptopinfo.find();
   console.log(avaiLaptops);
   try {
    const students = await enrollinfo.find();
    if (!students || students.length === 0) {
      return res.status(404).send("No students found");
    }

    // Ensure 'pdfs' folder exists
    const pdfDir = path.join(__dirname, "pdfs");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

    for (const student of students) {
      const safeName = student.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
      const pdfPath = path.join(pdfDir, `${safeName}_enrollment.pdf`);
      
      const doc = new PDFDocument({ margin: 30 });
      const writeStream = fs.createWriteStream(pdfPath);
      doc.pipe(writeStream);

      // Add text content
      doc.fontSize(16).text("Master Mind Computer Institute", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text("Enrollment Details", { align: "center", underline: true });
      doc.moveDown();

      doc.fontSize(12)
        .text(`Name: ${student.name}`)
        .text(`Father's Name: ${student.fathersname}`)
        .text(`Address: ${student.address}`)
        .text(`Village: ${student.village}`)
        .text(`Tehsil: ${student.tehsil}`)
        .text(`District: ${student.district}`)
        .text(`Pincode: ${student.pincode}`)
        .text(`DOB: ${student.dob}`)
        .text(`Education: ${student.qualification}`)
        .text(`Phone: ${student.phoneno}`)
        .text(`Courses Applied: ${student.courseapplied.join(", ")}`);

      // End PDF
      doc.end();

      // Wait for PDF to finish writing
      await new Promise(resolve => writeStream.on("finish", resolve));
    }

    // res.send("PDFs generated successfully in the 'pdfs' folder.");

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
 res.render("admin.ejs",{avaiLaptops});
});
//enroll Route
app.get("/home/enroll",async(req,res)=>{
   res.render("admission.ejs");
});

//post request of enroll
app.post("/home/enroll",upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'your_signature', maxCount: 1 },
  { name: 'father_signature', maxCount: 1 }
]),(req,res)=>{
  // Uploaded file names
  let photo = req.files['photo'][0].filename;
  let yourSig = req.files['your_signature'][0].filename;
  let fatherSig = req.files['father_signature'][0].filename;

let{name,fathername,address
  ,village,tehsil,district,pincode,dob,qualification,phoneno,courses}=req.body;
  if (Array.isArray(courses)) {
  courses = courses.join(", "); // convert array to comma-separated string
}
  let stdenrollinfo=new enrollinfo({
    name:name,
    fathersname:fathername,
    address:address,
    village:village,
    tehsil:tehsil,
    district:district,
    pincode:pincode,
    dob:dob,
    qualification:qualification,
    phoneno:phoneno,
   courseapplied:courses,
   stdphoto:photo,
   stdsign:yourSig,
   fathersign:fatherSig,
  });

 stdenrollinfo.save().then(res=>{console.log("student enroll info was saved")}).catch(err=>{console.log(err)});

res.redirect("/home/admin");
});

//course Route
app.get("/home/course",async(req,res)=>{
   res.render("courses.ejs");
});


app.listen(port,()=>{
    console.log("listening to port :8080");
});