# Modals

All modals should be created with `components/base/Modal` class as view layer and 
 `app/ModalHolder` as part that know what can you open on every moment.
 Every modal should have separated logic and view. In most cases modal should have own url.
 If Modal use ModalHolder, it will call `onClose` property after removing modal from DOM. 
 You need not to do anything for this behaviour.
 
## Page
Page should open modal after did mount event. And page should close modal before unmount event.
Also if modal were closed, page should return user to some url.

Example:
```jsx harmony
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { loadSomeData } from 'data/entity';

import ModalController from './ModalController';


export class Page extends PureComponent {
  componentWillMount() {
    const { loadSomeData, openPopup, history } = this.props;
    const anyOtherPropsYouWant = {};
    loadSomeData();
    openPopup({
      onClose: () => history.push('/any-back-url'),
      ...anyOtherPropsYouWant,
    });
  }

  componentWillUnmount() {
    this.props.closePopup();
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

const mapStateToProps = () => ({});

const mapActionToProps = {
  openPopup: ModalController.open,
  closePopup: ModalController.close,
  loadSomeData,
};

export default connect(mapStateToProps, mapActionToProps)(Page);

```

 
## Controller
Controller can be wrapped with `connect` if need.

Example:
```jsx harmony
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';

import { getPopupRegistration, openPopup, closePopup, Priority } from 'app/ModalHolder';

import Layout from './Layout';


export class Controller extends PureComponent {
  constructor(props) {
    super(props);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    this.props.closePopup();
    this.props.onCancel();
  }

  handleOk() {
    this.props.closePopup();
    this.props.onOk();
  }

  render() {
    const { myExtraContent } = this.props;
    return (<Layout onOk={this.handleOk} myExtraContent={myExtraContent} onCancel={this.handleCancel} />);
  }
}

Controller.propTypes = {
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  myExtraContent: PropTypes.node,
};

Controller.defaultProps = {
  myExtraContent: 'No content. Sorry',
};


function mapStateToProps(state) {
  return {};
}

const ConnectedController = connect(mapStateToProps)(Controller);

const registrationId = getPopupRegistration(ConnectedController);

ConnectedController.open = (...rest) => openPopup(registrationId, ...rest);
ConnectedController.close = () => closePopup({ popup: registrationId });

export default ConnectedController;
```
 
## Layout
Layout should use `Modal` with `isOpen` property.

Example:
```jsx harmony
import React, { PureComponent, PropTypes } from 'react';

import Button from 'components/base/Button';
import Modal from 'components/base/Modal';

import css from './style.scss';

const caption = 'My caption';

class Layout extends PureComponent {
  render() {
    const { myExtraContent, onOk, onCancel } = this.props;

    return (<Modal isOpen uniqId="modal" caption={caption} width="400px">
      <div>any content</div>
      <div>{myExtraContent}</div>
      <div className={css.buttons}>
        <Button 
          kind={Button.kind.glueGhost} 
          size={Button.size.large}
          onClick={onCancel} 
          width="100px"
        >
          Cancel
        </Button>
        
        <Button 
          kind={Button.kind.glueGhost} 
          size={Button.size.large}
          onClick={onOk} 
          width="100px"
        >
          Ok
        </Button>        
      </div>
    </Modal>);
  }
}

Layout.propTypes = {
  myExtraContent: PropTypes.any.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Layout;
```