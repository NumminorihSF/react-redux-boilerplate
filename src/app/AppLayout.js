/** @flow */
import React, { PropTypes, PureComponent } from 'react';
import Helmet from 'react-helmet';

import Header from './components/Header';
import css from './style.scss';

import PopupHolder from './PopupHolder';

class AppLayout extends PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={css.root}>

        <Helmet
          defaultTitle="Usummit"
          titleTemplate="%s - Usummit"
          meta={[]}
          htmlAttributes={{ lang: 'en' }}
        />

        <Header />

        <section className="MainContainer">
          <div className="container">
            <div className="MainContainer-grid">
              {children}
            </div>
          </div>
        </section>

        <PopupHolder />
      </div>
    );
  }
}

AppLayout.propTypes = {
  children: PropTypes.node,
};

export default AppLayout;
