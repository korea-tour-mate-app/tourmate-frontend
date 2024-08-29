// translation.ts
export const translateText = async (text: string, targetLang: string): Promise<string> => {
    const url = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-NCP-APIGW-API-KEY-ID': 'gj3an1q054',
      'X-NCP-APIGW-API-KEY': 'smmj9dGu6mF2ALK8cCcLoUIRAPUlqjsRPXYOkmgH',
    };
    const body = new URLSearchParams({
      source: 'auto', // 원본 언어
      target: targetLang, // 목표 언어
      text: text,
    }).toString();
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('API Response:', result); // 응답 데이터 로그
  
      // 응답 데이터가 예상된 구조를 가지고 있는지 확인
      if (result && result.message && result.message.result && result.message.result.translatedText) {
        return result.message.result.translatedText;
      } else {
        console.error('Translation result is missing in the response');
        return text; // 기본 텍스트 반환
      }
    } catch (error) {
      console.error('Translation Error:', error); // 오류 로그
      return text; // 오류 발생 시 원본 텍스트 반환
    }
  };
  