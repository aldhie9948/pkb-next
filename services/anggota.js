import axios from 'axios';
const baseURL = '/api/anggota';

const get = async () => {
  const response = await axios.get(baseURL);
  return response.data;
};

const add = async (anggota) => {
  const response = await axios.post(baseURL, anggota);
  return response.data;
};

const update = async (id, anggota) => {
  const response = await axios.put(`${baseURL}/${id}`, anggota);
  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(`${baseURL}/${id}`);
  return response.data;
};

export default {
  add,
  get,
  update,
  remove,
};
