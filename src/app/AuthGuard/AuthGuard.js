/** @flow */
import { Component } from 'react';
import { connect } from 'react-redux';

import noop from 'utils/noop';

import { setBackUrl } from './actions';

const checkAuth = noop;

export class AuthGuard extends Component<*, *, *> {
  constructor(props: *) {
    super(props);
    this.state = {
      isAuthed: false,
    };
  }

  componentWillMount() {
    this.props.checkAuth({
      afterSuccess: () => this.setState({ isAuthed: true }),
      afterError: () => {
        this.props.setBackUrl(this.props.location);
        this.props.history.replace('/login');
      },
    });
  }

  render() {
    const { children } = this.props;
    const { isAuthed } = this.state;
    if (!isAuthed) return null;
    return children;
  }
}

const mapStateToProps = () => ({});

const mapActionToProps = {
  checkAuth,
  setBackUrl,
};

export default connect(mapStateToProps, mapActionToProps)(AuthGuard);
