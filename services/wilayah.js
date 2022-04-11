import axios from 'axios';

const getAllProvinces = async () => {
  const response = await axios.get('/api/provinces');
  return response.data;
};

const getProvincy = async (id) => {
  const response = await axios.get(`/api/provinces/${id}`);
  return response.data;
};

const getRegencies = async (id) => {
  const response = await axios.get(`/api/regency/${id}`);
  return response.data;
};

const getDistrict = async (id) => {
  const response = await axios.get(`/api/district/${id}`);
  return response.data;
};

const getVillage = async (id) => {
  const response = await axios.get(`/api/village/${id}`);
  return response.data;
};

const getDemografi = async (name) => {
  const response = await axios.get(`/api/provinces/demografi/${name}`);
  return response.data;
};

// eslint-disable-next-line
export default {
  getAllProvinces,
  getProvincy,
  getRegencies,
  getDistrict,
  getVillage,
  getDemografi,
};
