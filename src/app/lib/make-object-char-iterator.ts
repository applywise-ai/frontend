import { deepClone } from "@/app/lib/deep-clone";

type ObjectType = { [key: string]: string | ObjectType | string[] };

/**
 * makeObjectCharIterator is a generator function that iterates a start object to
 * match an end object state by iterating through each string character.
 *
 * Note: Start object and end object must have the same structure and same keys.
 *       And they must have string or array or object as values.
 *
 * @example
 * const start = {a : ""}
 * const end = {a : "abc"};
 * const iterator = makeObjectCharIterator(start, end);
 * iterator.next().value // {a : "a"}
 * iterator.next().value // {a : "ab"}
 * iterator.next().value // {a : "abc"}
 */
export function* makeObjectCharIterator<T extends ObjectType>(
  start: T,
  end: T,
  level = 0
) {
  // Have to manually cast ObjectType type and return T type due to https://github.com/microsoft/TypeScript/issues/47357
  const object: ObjectType = level === 0 ? deepClone(start) : start;
  for (const [key, endValue] of Object.entries(end)) {
    if (typeof endValue === "object") {
      const recursiveIterator = makeObjectCharIterator(
        object[key] as ObjectType,
        endValue as ObjectType,
        level + 1
      );
      while (true) {
        const next = recursiveIterator.next();
        if (next.done) {
          break;
        }
        yield deepClone(object) as T;
      }
    } else {
      for (let i = 1; i <= endValue.length; i++) {
        object[key] = endValue.slice(0, i);
        yield deepClone(object) as T;
      }
    }
  }
}

export const countObjectChar = (object: ObjectType) => {
  let count = 0;
  for (const value of Object.values(object)) {
    if (typeof value === "object") {
      count += countObjectChar(value as ObjectType);
    } else if (typeof value === "string") {
      count += value.length;
    }
  }
  return count;
};
