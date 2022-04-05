import axios from 'axios';
const baseURL = '/api/demografi';

const get = async () => {
  const response = await axios.get(baseURL);
  return response;
};

const add = async (demografi) => {
  const response = await axios.post(baseURL, demografi);
  return response.data;
};

const update = async (idVillage, demografi) => {
  const response = await axios.put(`${baseURL}/${idVillage}`, demografi);
  return response.data;
};

const getByProvincy = async (idVillage) => {
  const response = await axios.get(`${baseURL}/${idVillage}`);
  return response.data;
};

// eslint-disable-next-line
export default {
  get,
  getByProvincy,
  add,
  update,
};
