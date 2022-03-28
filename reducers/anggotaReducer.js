import { createSlice } from '@reduxjs/toolkit';
import anggotaService from '../services/anggota';

const anggotaSlice = createSlice({
  name: 'anggota',
  initialState: [],
  reducers: {
    setAnggota: (state, action) => {
      return action.payload;
    },
    appendAnggota: (state, action) => {
      return [...state, action.payload];
    },
    editAnggota: (state, action) => {
      const editedAnggota = state.filter((f) => f.id !== action.payload.id);
      return [...editedAnggota, action.payload];
    },
    removeAnggota: (state, action) => {
      const removedAnggota = state.filter((f) => f.id !== action.payload.id);
      console.log('removed anggota: ', removedAnggota);
      return [...removedAnggota];
    },
  },
});

export const { setAnggota, appendAnggota, editAnggota, removeAnggota } =
  anggotaSlice.actions;
export default anggotaSlice.reducer;

export const initAnggota = () => {
  return async (dispatch) => {
    const response = await anggotaService.get();
    dispatch(setAnggota(response));
  };
};

export const saveAnggota = (anggota) => {
  return async (dispatch) => {
    const response = await anggotaService.add(anggota);
    dispatch(appendAnggota(response));
  };
};

export const updateAnggota = (id, anggota) => {
  return async (dispatch) => {
    const response = await anggotaService.update(id, anggota);
    dispatch(editAnggota(response));
  };
};

export const deleteAnggota = (id) => {
  return async (dispatch) => {
    const response = await anggotaService.remove(id);
    dispatch(removeAnggota(response));
  };
};
