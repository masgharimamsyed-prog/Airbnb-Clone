const mongoose = require("mongoose");
const sampleListings = require("./sampleData");
const Listing = require("./listingsmongoose");

async function func() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/AirBnb");

        console.log("Connected to MongoDB!");

        await Listing.deleteMany({});

        const updatedListings = sampleListings.map((obj) => ({
            ...obj,
            owner: "6aeed5e34d4c5ccf65dbbaea"
        }));

        await Listing.insertMany(updatedListings);

        console.log("Data inserted successfully!");

    } catch (err) {
        console.log(err);

    }
}
func();