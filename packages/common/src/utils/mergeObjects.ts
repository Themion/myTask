import { JsonObject } from '../types';

const isObject = (item: any) => typeof item === 'object';

const mergeObjects = (...objects: JsonObject[]): JsonObject =>
  objects.reverse().reduce(
    (mergedObject, currentObject) =>
      Object.keys(currentObject).reduce((object, key) => {
        const isBothValObject = isObject(mergedObject[key]) && isObject(currentObject[key]);

        const value = isBothValObject
          ? mergeObjects(currentObject[key] as JsonObject, mergedObject[key] as JsonObject)
          : currentObject[key];

        return { ...object, [key]: value };
      }, structuredClone(mergedObject)),
    {} as JsonObject,
  );

export default mergeObjects;
