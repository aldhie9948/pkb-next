import { configureStore } from '@reduxjs/toolkit';
import wilayahOptionsReducer from './reducers/wilayahOptionsReducer';
import anggotaReducer from './reducers/anggotaReducer';
import demografiReducer from './reducers/demografiReducer';

export const store = configureStore({
  reducer: {
    wilayahOptions: wilayahOptionsReducer,
    anggota: anggotaReducer,
    demografi: demografiReducer,
  },
});
