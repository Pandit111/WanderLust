require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;

const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");

main().then(() => {
    console.log("connected to DB");
}) .catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// Redirect root to listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings }); // ✅ Correct way
 });



 //new route
 app.get("/listings/new", (req, res )=> {
    res.render("listings/new.ejs");
 });

 //show route

 app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing });
 });
 
 //create route

 app.post("/listings", async (req, res) => {
   const newListing = new Listing(req.body.listing);
  await newListing.save();
    res.redirect("/listings");

 });

 //edit route

 app.get("/listings/:id/edit", async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

 });

 //update route
 app.put("/listings/:id", async (req, res ) => {
    let { id } = req.params;
   await Listing. findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listings/${id}`);
 });

 //Delete route

 app.delete ("/listings/:id", async (req , res)  =>{
    let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
 });
app.get("/testlisting", async (req, res) => {
    let sampleListing = new Listing({
        title: "Test Home",
        description: "A simple test listing",
        price: 999,
        location: "Goa",
        country: "India",
        image: "https://placehold.co/600x400"
    });
    await sampleListing.save();
    res.send("Sample listing created");
    
});


app.listen(process.env.PORT || 8080, () => {
  console.log(`✅ Server is running on port ${process.env.PORT || 8080}`);
});


