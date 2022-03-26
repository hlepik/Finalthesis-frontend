import _ from "lodash";

export const objToFormData = (object: { [key: string]: any }): FormData => {
  const formData = new FormData();
  Object.entries(object)
    .filter(([, value]) => !_.isNil(value))
    .forEach(([key, value]) => {
      if (value instanceof Array) {
        object[key].forEach((item: any) => formData.append(key, item));
      } else {
        formData.set(key, value);
      }
    });
  return formData;
};
