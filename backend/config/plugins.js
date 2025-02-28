module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: env('NODE_ENV') === 'production' ? 'cloudinary' : 'local',
      providerOptions: env('NODE_ENV') === 'production' ? {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      } : {},
      actionOptions: {
        upload: env('NODE_ENV') === 'production' ? {
          folder: "strapi-uploads",
          transformation: [
            // Thumbnail version
            { 
              width: 800, 
              height: 533, 
              crop: 'fill',
              quality: 'auto',
              fetch_format: 'auto',
              resource_type: 'image',
              format: 'webp'
            },
            // Detail version
            { 
              width: 1200, 
              height: 800,
              crop: 'fill',
              quality: 'auto',
              fetch_format: 'auto',
              resource_type: 'image',
              format: 'webp'
            }
          ]
        } : {}
      }
    }
  }
});
