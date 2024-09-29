/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Schema, SchemaOptions } from 'mongoose';

// Extend the Mongoose Schema to include the options property
interface SchemaWithOptions extends Schema {
  options: SchemaOptions;
}

interface TransformOptions {
  transform?: (doc: Document, ret: any, options: any) => any;
}

function makeFieldsPrivatePlugin<T>(
  schema: Schema<T>,
  privateFields: string[]
): void {
  const schemaWithOptions = schema as unknown as SchemaWithOptions;

  function removePrivateFields(_doc: Document, ret: any) {
    privateFields.forEach((field) => delete ret[field]);
    return ret;
  }

  const toJSONOptions = (schemaWithOptions.options.toJSON ||
    {}) as TransformOptions;
  const originalToJSON = toJSONOptions.transform;
  toJSONOptions.transform = function (doc: Document, ret: any, options: any) {
    if (originalToJSON) {
      ret = originalToJSON(doc, ret, options);
    }
    return removePrivateFields(doc, ret);
  };
  schemaWithOptions.set('toJSON', toJSONOptions);

  const toObjectOptions = (schemaWithOptions.options.toObject ||
    {}) as TransformOptions;
  const originalToObject = toObjectOptions.transform;
  toObjectOptions.transform = function (doc: Document, ret: any, options: any) {
    if (originalToObject) {
      ret = originalToObject(doc, ret, options);
    }
    return removePrivateFields(doc, ret);
  };
  schemaWithOptions.set('toObject', toObjectOptions);

  privateFields.forEach((field) => {
    const schemaPath = schema.path(field);
    if (schemaPath) {
      schemaPath.select(false);
    }
  });
}

export default makeFieldsPrivatePlugin;
