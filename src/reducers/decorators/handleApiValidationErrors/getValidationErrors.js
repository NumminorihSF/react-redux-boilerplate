/** @flow */
export type ValidationError = {
  field: string;
  errors: Array<string>;
};


type ValidationErrors = Array<ValidationError>;

const EMPTY_RESULT = {};


export default function getValidationErrors(validationErrors: ?ValidationErrors) {
  if (!validationErrors) return EMPTY_RESULT;
  if (!Array.isArray(validationErrors)) return EMPTY_RESULT;

  return validationErrors.reduce((errors, fieldset) => ({
    ...errors,
    [fieldset.field]: [...fieldset.errors],
  }), EMPTY_RESULT);
}
