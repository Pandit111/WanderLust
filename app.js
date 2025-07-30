require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;

const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main()
  .then(() => {
    console.log("✅ connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Set up view engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Root route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// INDEX route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});

// NEW route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE route
app.post("/listings", async (req, res) => {
  const { title, description, price, location, country, image } = req.body.listing;

  const newListing = new Listing({
    title,
    description,
    price,
    location,
    country,
    image: {
      filename: image.filename || "listingimage",
      url: image.url
    }
  });

  await newListing.save();
  res.redirect("/listings");
});


// SHOW route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// EDIT route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// UPDATE route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country, image } = req.body.listing;

  await Listing.findByIdAndUpdate(id, {
    title,
    description,
    price,
    location,
    country,
    image: {
      filename: image.filename || "listingimage",
      url: image.url
    }
  });

  res.redirect(`/listings/${id}`);
});


// DELETE route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

// Server
app.listen(process.env.PORT || 8080, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT || 8080}`);
});
