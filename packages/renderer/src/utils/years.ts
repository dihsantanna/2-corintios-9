export const getYears = (start = 2000, end: number = new Date().getFullYear()) => {
  const years: number[] = [];
  for (let i = end; i >= start; i--) {
    years.push(i);
  }
  return years;
};
