import React from 'react';
import { List } from 'immutable';

import Form, { bindToState, Input, Select, TextArea } from './';

const colors = new List(['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet']);

const ExampleForm = (props) => {
  const { handleSubmit, submitting } = props;
  return (
    <Form name="" onSubmit={handleSubmit}>
      <div>
        <Input name="firstName" type="text" placeholder="First Name" />
      </div>
      <div>
        <Select name="favoriteColor" options={colors} />
      </div>
      <div>
        <TextArea name="bio" rows="10" />
      </div>
      <div>
        <button type="submit" disabled={submitting}>Submit</button>
      </div>
    </Form>
  );
};

// Also reducer should add some ImmutableMap on state path (['path', 'to', 'big', 'state', 'my-form']).
export default bindToState(['path', 'to', 'big', 'state'], 'my-form', ExampleForm);
// Or like this
// export default bindToState('path.to.big.state', 'my-form', ExampleForm);
