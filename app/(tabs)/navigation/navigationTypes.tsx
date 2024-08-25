export type RootStackParamList = {
  splash: undefined;
  '(tabs)/home': undefined; 
  '(tabs)/recommend-page/day': { totalDays: number; startDate: string; endDate: string };
  '(tabs)/recommend-page/withWho': { totalDays: number; startDate: string; endDate: string };
  '(tabs)/recommend-page/budget': { totalDays: number; startDate: string; endDate: string };
  '(tabs)/route-page/route': { totalDays: number; startDate: string; endDate: string };
};
