import { reduxStorage } from '../modules/mmkv-storage/ReduxPersist'
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, PERSIST, REHYDRATE, PAUSE, FLUSH, PURGE, REGISTER } from 'redux-persist'
import UserReducer from './reducers/UserReducer'

const userPersistConfig = {
  key: 'user',
  storage: reduxStorage
}

export const store: any = configureStore({
  reducer: {
    user: persistReducer(userPersistConfig, UserReducer)
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST, REHYDRATE, PAUSE, FLUSH, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
