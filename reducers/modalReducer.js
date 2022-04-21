import { createSlice } from '@reduxjs/toolkit';
const modalSlice = createSlice({
  name: 'modal',
  initialState: { status: false, data: null },
  reducers: {
    setModalShow: (state, action) => {
      return { ...state, status: true };
    },
    setModalHidden: (state, action) => {
      return { ...state, status: false };
    },
    setModalData: (state, action) => {
      return { ...state, data: action.payload };
    },
  },
});

export default modalSlice.reducer;
export const { setModalShow, setModalHidden, setModalData } =
  modalSlice.actions;
