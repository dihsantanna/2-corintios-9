export const getYears = (
  start = 2020,
  end: number = new Date().getFullYear()
) => {
  const years: number[] = [];
  for (let i = end; i >= start; i -= 1) {
    years.push(i);
  }
  return years;
};
