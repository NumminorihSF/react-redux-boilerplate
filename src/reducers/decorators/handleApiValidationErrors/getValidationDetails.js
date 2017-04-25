/** @flow */
export default function getValidationDetails(detail: ?string = null) {
  if (detail === null) return null;
  return String(detail);
}
