/*
This is temp component. Does not write code like this!
 */
import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

const routesSelector = props => props.routes;
const generateRoutesMap = (routes) => {
  const result = [];
  const mapRoutes = (routes, prefix = []) => {
    routes.forEach((route) => {
      if (route.indexRoute) {
        result.push({
          name: [...prefix, route.path].join('/').replace(/\/\//g, '/'),
          url: [...prefix, route.path].join('/').replace(/\/\//g, '/'),
        });
      }
      if (route.component) {
        result.push({
          name: `${[...prefix, route.path].join('/')}_Comp`.replace(/\/\//g, '/'),
          url: [...prefix, route.path].join('/').replace(/\/\//g, '/'),
        });
      }
      if (route.childRoutes) {
        mapRoutes(route.childRoutes, [...prefix, route.path]);
      }
    });
  };
  mapRoutes(routes);
  return result;
};

const routesMapSelector = createSelector(
  routesSelector,
  generateRoutesMap,
);

function mapStateToProps(state, props) {
  return {
    routes: routesMapSelector(props),
  };
}

class SiteMap extends PureComponent {
  render() {
    const routes = this.props.routes.map(({ name, url }) => <p key={`${name} ${url}`}>{name} - <Link to={url}>go to</Link></p>);
    return (
      <div style={{ marginLeft: 12 }}>
        {routes}
      </div>
    );
  }
}
export default connect(mapStateToProps)(SiteMap);

/*
 This is temp component. Does not write code like this!
 */
