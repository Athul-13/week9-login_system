const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dncoxucat',
    api_key: '539815168352155',
    api_secret: 'aUp9ASnpm3xKvzjsygOC_AuHLI0',
});

module.exports = cloudinary;