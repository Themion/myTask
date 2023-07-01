type ObjectType = { [key: string]: any };

const isObject = (item: any) => typeof item === 'object';

const mergeObjects = (...objects: ObjectType[]): ObjectType =>
  objects.reverse().reduce(
    (mergedObject, currentObject) =>
      Object.keys(currentObject).reduce((object, key) => {
        const isBothValObject = isObject(mergedObject[key]) && isObject(currentObject[key]);

        const value = isBothValObject
          ? mergeObjects(currentObject[key], mergedObject[key])
          : currentObject[key];

        return { ...object, [key]: value };
      }, structuredClone(mergedObject)),
    {} as ObjectType,
  );

export default mergeObjects;
