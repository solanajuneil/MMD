import * as SecureStore from 'expo-secure-store'

export const saveToSecureStore = async (key = "", value = "") => {
    await SecureStore.setItemAsync(key, value)
}

export const getFromSecureStore = async (key = "") => {
    return await SecureStore.getItemAsync(key)
}
