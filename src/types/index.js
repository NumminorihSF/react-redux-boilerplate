/** @flow */
export type ValidationError = {
  field: string;
  errors: Array<string>;
};

export type APiErrorDetails = {
  validationErrors?: Array<ValidationError>;
  detail: string;
  code: string;
};

