# Structure

## Routes structure

```
src/app
  routes/
    NextRoute/
      getRoutes.js
      index.js
      Page.js
      Layout.js
  getRoutes.js
  index.js
  Page.js
  Layout.js
```

### getRoutes
This file should export function that return routes.
If route has any sub-routes it should encapsulate them.

Example:
```jsx
/** @flow */
import React from 'react';
import { Route, IndexRoute } from 'react-router';

import { getRoutes as getSubRoutes } from './routes/SubRoute'
import Page from './Page';

const subRoutes = getSubRoutes();

export default () => (<Route>
  {subRoutes}
  <IndexRoute component={Page} />
</Route>);
```

### index.js

This file is used to reexport routes, page, and layout.

Example:
```jsx
/** @flow */
import Page from './Page';
import Layout from './Layout';
import getRoutes from './getRoutes';

export default Page;
export {
  Layout,
  Page,
  getRoutes,
};
```

### Page.js
This file is used to append title and base logic into page.

Example:
```jsx
/** @flow */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { loadSomeData } from 'any-actions-file';

import Layout from './Layout';

class Page extends PureComponent {
  componentWillMount() {
    this.props.loadSomeData();
  }

  render() { 
    return (
      <div>
        <Helmet title="Login" />
        <Layout {...this.props} />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

const mapActionToProps = {
  loadSomeData,
};

export default connect(mapStateToProps, mapActionToProps)(Page);
```

### Layout.js
File for page's markup.

Example:
```jsx
import React from 'react';
import { pure } from 'recompose';

import css from './style.scss';

export const Layout = ({ onSubmit }) => (
  <div className={css.root}>
   <form onSubmit={onSubmit}>
     <label htmlFor="field" className={css.label}>Field</label>
     <input type="text" name="field" id="field" className={css.input} />
     <button className={css.button}>Submit</button>
   </form>
  </div>
);

export default pure(Layout);
```

## Component structure
For component's in route structure we'll use something like:
```
SomeRoute/
  components/
    Component/
      index.js
      Component.js
      Layout.js
      selectors.js
  ...route files
```

### index.js
File to reexport Controller, Layout, selectors. Should reexport Controller as default.

Example:
```jsx
/** @flow */
import Component from './Component';
import Layout from './Layout';

export default Component;
export { Component, Layout };
```

### Component.js
Should encapsulate logic and bing component with state.

Example:
```jsx
/** @flow */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { callAction } from 'any-actions-file';

import Layout from './Layout';
import { selectStatePart } from './selectors';

export class Component extends PureComponent {
  /* :: handleSomeAction: Function */
  constructor(props) {
    super(props);
    this.handleSomeAction = this.handleSomeAction.bind(this);
  }

  handleSomeAction() {
    // Only if need any argument's transform.
    this.props.callAction();
  }

  render() {
    return (<Layout { ...this.props} onSoneAction={this.handleSomeAction} />);
  }
}

Component.propTypes = {
  callAction: PropTypes.func.isRequired,
};

function mapStateToProps (state, ownProps) {
  return {
    statePart: selectStatePart(state, ownProps),
  };
}

const mapActionToProps = {
  callAction,
}

export default connect(mapStateToProps, mapActionToProps)(Component);
```


### Layout.js
Layout's file. It's a stateless component with `pure` wrapper as usually. 
Should be like page's layout.

### selectors.js
This is an selectors file that use selectors from data's folder to get only data that component need.

Example:
```jsx
/** @flow */
import { createSelector } from 'reselect';

import { selectSomeData } from 'data/some-data';
import { selectAnotherData } from 'data/another-data';

export const selectStatePart = createSelector(
  [selectSomeData, selectAnotherData],
  (someData, anotherData) => transformToUseInComponent(someData, anotherData),
);
```



## Component's directory
There is a directory `src/components` in project. In this directory should be placed only
 components with encapsulated logic but without any binding with application's data.
 
`src/components/base` is a directory for basic components (such a wrappers for html tags).

`src/components/hoc` is a High Order Components for append some "logic" into components.
For example loadable/dropdownable and something else.



