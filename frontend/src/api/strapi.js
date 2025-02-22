import axios from 'axios';

export const strapiApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStrapiURL = (path = '') => {
  return `http://localhost:1337${path}`;
};

export const getStrapiMedia = (media) => {
  if (!media || !media.data || !media.data.attributes) {
    return null;
  }
  const { url } = media.data.attributes;
  return getStrapiURL(url);
};
