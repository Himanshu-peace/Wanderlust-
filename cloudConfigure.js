const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');

//configuring cloud credentials 
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

//defining storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wandelust_DEVELOPMENT',
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });

  module.exports= {
    cloudinary,
    storage,
  };  //used in listing routes