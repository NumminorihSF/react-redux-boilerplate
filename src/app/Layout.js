/** @flow */
import React, { PropTypes, PureComponent } from 'react';
import Helmet from 'react-helmet';

import css from './style.scss';

const meta = [];
const htmlAttributes = { lang: 'en' };

class Layout extends PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={css.root}>

        <Helmet
          defaultTitle="Usummit"
          titleTemplate="%s - Usummit"
          meta={meta}
          htmlAttributes={htmlAttributes}
        />

        <section className="MainContainer">
          <div className="container">
            <div className="MainContainer-grid">
              {children}
            </div>
          </div>
        </section>

      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
