module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {
          folder: "strapi-uploads",
          transformation: {
            quality: 'auto',
            fetch_format: 'auto',
            width: 'auto',
            crop: 'scale',
          },
        },
        delete: {},
      },
    },
  },
});
