import { createSlice } from '@reduxjs/toolkit';
import demografiService from '../services/demografi';

const demografiSlice = createSlice({
  name: 'demografi',
  initialState: [],
  reducers: {
    setDemografi: (state, action) => {
      return action.payload;
    },
    addDemografi: (state, action) => {
      return [...state, action.payload];
    },
    editDemografi: (state, action) => {
      const newDemografi = state.filter(
        (f) => f.regions.village !== action.payload.regions.village
      );
      return [...newDemografi, action.payload];
    },
  },
});

export default demografiSlice.reducer;
export const { setDemografi, addDemografi, editDemografi } =
  demografiSlice.actions;

export const initDemografi = () => {
  return async (dispatch) => {
    const response = await demografiService.get();
    dispatch(setDemografi(response));
  };
};

export const getDemografiByProvincy = (idProvincy) => {
  return async (dispatch) => {
    const response = await demografiService.getByProvincy(idProvincy);
    dispatch(setDemografi(response));
  };
};

export const appendDemografi = (demografi) => {
  return async (dispatch) => {
    const response = await demografiService.add(demografi);
    dispatch(addDemografi(response));
  };
};

export const updateDemografi = (demografi) => {
  return async (dispatch) => {
    const response = await demografiService.update(demografi);
    dispatch(editDemografi(response));
  };
};
