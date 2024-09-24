import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectionContextProps {
  // 선택된 테마들
  selectedThemes: number[];  // int 배열로 유지
  setSelectedThemes: (themes: number[]) => void;

  // 출발일(string), 도착일(string), 여행 일수(number) (문자열과 숫자가 혼합된 배열로 변경)
  selectedDay: Array<string | number>;
  setSelectedDay: (day: Array<string | number>) => void;

  // 누구와 함께 갈지
  selectedWithWho: number[];  
  setSelectedWithWho: (withWho: number[]) => void; // 배열 타입으로 변경

  // 어떤 교통수단 이용할지
  selectedVehicle: number;  
  setSelectedVehicle: (vehicle: number) => void;
}

// 기본값을 설정하여 undefined 없이 SelectionContext 생성
const defaultSelectionContext: SelectionContextProps = {
  selectedThemes: [],  // 초기값 0, 1, 2, 3, 4
  setSelectedThemes: () => {},
  selectedDay: ["24.10.1", "24.10.2", 2],  // 초기값 설정
  setSelectedDay: () => {},
  selectedWithWho: [],
  setSelectedWithWho: () => {},
  selectedVehicle: 0,
  setSelectedVehicle: () => {},
};

export const SelectionContext = createContext<SelectionContextProps>(defaultSelectionContext);

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedThemes, setSelectedThemes] = useState<number[]>([]);  // 초기값 0, 1
  const [selectedDay, setSelectedDay] = useState<Array<string | number>>(["24.10.1", "24.10.2", 3]);  // 초기값 설정
  const [selectedWithWho, setSelectedWithWho] = useState<number[]>([]); // number 배열 타입으로 변경
  const [selectedVehicle, setSelectedVehicle] = useState<number>(0);

  return (
    <SelectionContext.Provider
      value={{
        selectedThemes,
        setSelectedThemes,
        selectedDay,
        setSelectedDay,
        selectedWithWho,
        setSelectedWithWho,
        selectedVehicle,
        setSelectedVehicle,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

// useSelection 훅을 사용하여 context를 쉽게 사용할 수 있습니다.
export const useSelection = () => useContext(SelectionContext);