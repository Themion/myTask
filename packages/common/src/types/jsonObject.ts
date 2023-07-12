type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

type JsonObject = {
  [key: string]: JsonValue;
};

export default JsonObject;
