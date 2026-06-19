import { Storage } from 'redux-persist'
import { createMMKV } from 'react-native-mmkv'

const storage = createMMKV()

export const reduxStorage: Storage = {
  setItem: (key: string, value: any) => {
    storage.set(key, value)
    return Promise.resolve(true)
  },
  getItem: (key: string) => {
    const value = storage.getString(key)
    return Promise.resolve(value)
  },
  removeItem: (key: string) => {
    storage.remove(key)
    return Promise.resolve()
  }
}
