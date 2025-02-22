import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export const strapiApi = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStrapiURL = (path = '') => {
  return `${API_URL}${path}`;
};

export const getStrapiMedia = (media) => {
  if (!media || !media.data || !media.data.attributes) {
    return null;
  }
  const { url } = media.data.attributes;
  return getStrapiURL(url);
};
