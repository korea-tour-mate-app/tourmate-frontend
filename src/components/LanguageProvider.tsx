import React, { createContext, useContext, useState } from 'react';

// LanguageContext를 생성합니다. 기본 언어와 setLanguage 함수의 타입을 정의합니다.
const LanguageContext = createContext({
  language: 'ko', // 기본 언어 설정
  setLanguage: (language: string) => {},
});

// LanguageProvider 컴포넌트는 상태를 제공하고, 자식 컴포넌트들에게 context를 제공합니다.
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('ko'); // 기본 언어를 'ko'로 설정

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// useLanguage 훅을 사용하여 context를 쉽게 사용할 수 있습니다.
export const useLanguage = () => useContext(LanguageContext);
