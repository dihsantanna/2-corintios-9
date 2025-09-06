/**
 * Verifica se um valor é um objeto plano
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Mescla múltiplos objetos de forma eficiente
 * @param objects - Objetos a serem mesclados
 * @returns Novo objeto com todas as propriedades
 */
export function mergeObjects<T extends Record<string, any>>(
  ...objects: (T | Record<string, any>)[]
): T {
  if (objects.length === 0) return {} as T;
  if (objects.length === 1) return { ...objects[0] } as T;

  const result = { ...objects[0] } as T;

  for (let i = 1; i < objects.length; i++) {
    const obj = objects[i];
    if (!obj) continue;

    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

      const currentValue = obj[key];
      const existingValue = result[key];

      if (isPlainObject(currentValue) && isPlainObject(existingValue)) {
        (result as Record<string, unknown>)[key] = mergeObjects(
          existingValue,
          currentValue,
        );
      } else {
        (result as Record<string, unknown>)[key] = currentValue;
      }
    }
  }

  return result;
}
