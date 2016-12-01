import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadQuestions } from '../actions/questions'
import Questions from '../components/Questions'
import Helmet from 'react-helmet'

const questions = [123, 234]

class QuestionContainer extends Component {
  static fetchData({ store }) {
    return store.dispatch(loadQuestions())
  }

  componentDidMount() {
    this.props.loadQuestions()
  }
  render() {
    return (
      <div>
        <Helmet
          title="Questions"
        />
        <Questions questions={questions} />
        {props.children}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { questions: state.questions }
}

export { QuestionContainer }
export default connect(mapStateToProps, { loadQuestions })(QuestionContainer)
