import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeData(key: string, data: string | number | object) {
  if (!data) {
    return;
  }

  let normalizedData;
  if (typeof data === 'object') {
    normalizedData = JSON.stringify(data);
  } else if (typeof data === 'number') {
    normalizedData = data.toString();
  } else {
    normalizedData = data;
  }

  try {
    await AsyncStorage.setItem(key, normalizedData);
  } catch (err) {
    console.error('Failed to store the data in local');
  }
}

export async function getData(key: string, defaultValue?: any) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value || defaultValue;
  } catch (e) {
    console.error('Failed to read the data from local');
  }
}
