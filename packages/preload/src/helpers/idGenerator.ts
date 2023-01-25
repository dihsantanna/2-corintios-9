export const idGenerator = () =>
  (Math.round(Math.random() * (9999 - 2) + 2) * Date.now()).toString(8).slice(0, 14);
