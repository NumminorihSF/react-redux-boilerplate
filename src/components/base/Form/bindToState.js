/** @flow */
import type { Component } from 'react';
import { reduxForm } from 'redux-form/immutable';

export default function bindWidthState(
  statePath: string | string[],
  field: string,
  Component: Class<Component<*, *, *>>,
): Class<Component<*, *, *>> {
  let path = [];
  if (typeof statePath === 'string') {
    path = statePath.split('.');
  }
  if (Array.isArray(statePath)) {
    path = [...statePath];
  }
  return reduxForm({
    form: path.concat(field).join('.'),
    getFormState: state => state,
  })(Component);
}
