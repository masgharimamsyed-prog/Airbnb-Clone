const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY_CLOUD,
    api_secret:process.env.API_SECRET_CLOUD,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'AirBnb_DEV',
     allowed_formats:["png","jpeg","jpg"], // supports promises as well
  },
});

module.exports={
    cloudinary,
    storage,
}