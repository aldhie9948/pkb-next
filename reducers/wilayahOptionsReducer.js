import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  provinsi: [],
  kabupaten: [],
  kecamatan: [],
  kelurahan: [],
};

const wilayahOptions = createSlice({
  name: 'wilayahForm',
  initialState,
  reducers: {
    setProvinsi: (state, action) => {
      return {
        ...state,
        provinsi: action.payload,
      };
    },
    setKabupaten: (state, action) => {
      return {
        ...state,
        kabupaten: action.payload,
      };
    },
    setKecamatan: (state, action) => {
      return {
        ...state,
        kecamatan: action.payload,
      };
    },
    setKelurahan: (state, action) => {
      return {
        ...state,
        kelurahan: action.payload,
      };
    },
  },
});

export const { setProvinsi, setKabupaten, setKecamatan, setKelurahan } =
  wilayahOptions.actions;
export default wilayahOptions.reducer;

export const setProvinsiOptions = () => {
  return async (dispatch) => {
    const provinsi = await axios.get(`/api/provinces/`);
    const data = provinsi.data.map((d) => ({ label: d.name, value: d.id }));
    dispatch(setProvinsi(data));
  };
};

export const setKabupatenOptions = (id) => {
  return async (dispatch) => {
    const kabupaten = await axios.get(`/api/provinces/${id}`);
    const data = kabupaten.data[0].regencies.map((d) => ({
      label: d.name,
      value: d.id,
    }));
    dispatch(setKabupaten(data));
  };
};

export const setKecamatanOptions = (id) => {
  return async (dispatch) => {
    const kecamatan = await axios.get(`/api/regency/${id}`);
    console.log(kecamatan.data);
    const data = kecamatan.data[0].districts.map((d) => ({
      label: d.name,
      value: d.id,
    }));
    dispatch(setKecamatan(data));
  };
};

export const setKelurahanOptions = (id) => {
  return async (dispatch) => {
    const kelurahan = await axios.get(`/api/district/${id}`);
    console.log(kelurahan.data);
    const data = kelurahan.data[0].villages.map((d) => ({
      label: d.name,
      value: d.id,
    }));
    dispatch(setKelurahan(data));
  };
};
