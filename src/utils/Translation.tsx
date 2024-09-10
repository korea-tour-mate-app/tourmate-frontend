import { Alert } from 'react-native';

export const translateText = async (text: string, targetLang: string): Promise<string> => {
  
  // targetLang이 'ko'인 경우 원문 반환
  if (targetLang === 'ko') {
    return text;
  }

  const url = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-NCP-APIGW-API-KEY-ID': '7mnq85awxz',
    'X-NCP-APIGW-API-KEY': 'BF8JtYez1BcFUrUIpwXXg4B9YkmPVrJwN8iA9Ay2',
  };
  const body = new URLSearchParams({
    source: 'auto',
    target: targetLang,
    text: text,
  }).toString();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    const responseText = await response.text();

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      throw new Error('Failed to parse JSON response');
    }

    if (result && result.message && result.message.result && result.message.result.translatedText) {
      return result.message.result.translatedText;
    } else {
      return text;
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert('Translation Error', error.message);
    } else {
      Alert.alert('Translation Error', 'An unknown error occurred');
    }
    return text;
  }
};
