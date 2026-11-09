const listing = require('../init/listingsmongoose.js');
const ListingSchemaJoi = require("../Joi/listing.js");

//MAP
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });




module.exports.showAllListings = async (req, res) => {
  try {

    const result = await listing.find({});
    res.render("listings/AllListings.ejs", { result });
  } catch (err) {
    res.send("error while getting all list ");
  }
};

module.exports.redirectTolistingCreateForm = async (req, res) => {
  res.render("listings/newList.ejs");
}

module.exports.specificList = async (req, res) => {
  let { id } = req.params;
  const result = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
      },
    })
    .populate("owner");
  if (!result) {
    req.flash("failure", "Listing You request for,does not exist!");
    res.redirect("/listings");
    return;
  }

  res.render("listings/SingleList.ejs", { result });

}

module.exports.listEditForm = async (req, res) => {
  let { id } = req.params;
  const result = await listing.findById(id);
  if (!result) {
    req.flash("failure", "Listing You request for,does not exist!");
    res.redirect("/listings");
    return;
  }
  if (!req.user._id.equals(result.owner)) {
    req.flash("failure", "Listing You request for,does not belong to you!");
    res.redirect(`/listings/${id}`);
    return;
  }

  res.render("listings/EditList.ejs", { result });
}

module.exports.listPatching = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { newDescription, newTitle, newPrice, newLocation, newCountry } = req.body;

    const prevList = await listing.findById(id);
    
    if (!prevList) {
      req.flash("failure", "Listing not found!");
      return res.redirect("/listings");
    }
    if (!prevList.owner.equals(req.user._id)) {
      req.flash("failure", "You are not authorized!");
      return res.redirect(`/listings/${id}`);
    }

    let response = await geocodingClient.forwardGeocode({
      query: `${newLocation}, ${newCountry}`,
      limit: 1,
    }).send();

    if (response.body.features.length === 0) {
      req.flash("failure", "Location not found!");
      return res.redirect(`/listings/edit/${id}`);
    }

    let url = prevList.image.url;
    let filename = prevList.image.filename;

    if (req.file) {
      url = req.file.path;
      filename = req.file.filename;
    }

    const temp = {
      title: newTitle,
      price: newPrice,
      description: newDescription,
      location: newLocation,
      country: newCountry,
      owner: req.user._id.toString(),

      image: {
        url,
        filename,
      },

      geometry: response.body.features[0].geometry,
    };

    const value = await ListingSchemaJoi.validateAsync(temp);

    await listing.findByIdAndUpdate(
      id,
      value,
      { new: true, runValidators: true }
    );

    req.flash("success", "Listing edited Successfully!");
    res.redirect("/listings");

  } catch (err) {
    req.flash("failure", `${err}`);
    res.redirect("/listings");
  }
};

module.exports.destroyList = async (req, res) => {
  let { id } = req.params;
  const result = await listing.findById(id);
  if (!result) {
    req.flash("failure", "Listing You request for,does not exist!");
    res.redirect("/listings");
    return;
  }
  if (!req.user._id.equals(result.owner)) {
    req.flash("failure", "Listing You request for,does not belong to you!");
    res.redirect(`/listings/${id}`);
    return;
  }
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted Successfully!");
  res.redirect("/listings");


};

module.exports.listFromFormToDB = async (req, res) => {
  let { newDescription, newTitle, newPrice, newLocation, newCountry } = req.body;
  let response = await geocodingClient.forwardGeocode({
    query: `${newLocation}, ${newCountry}`,
    limit: 1,
  })
    .send()


  const temp = {
    title: newTitle,
    description: newDescription,
    price: newPrice,
    location: newLocation,
    country: newCountry,
    image: {
      url: req.file.path,
      filename: req.file.filename,
    },
    owner: req.user._id.toString(),
  }
  if (response.body.features.length === 0) {
    req.flash("failure", "Location not found!");
    return res.redirect("/listings/new");
  }
  temp.geometry = response.body.features[0].geometry;
  await ListingSchemaJoi.validateAsync(temp);
  let savedList = await listing.insertOne(temp);
  req.flash("success", "New Listing Created Successfully!");
  res.redirect("/listings");

};