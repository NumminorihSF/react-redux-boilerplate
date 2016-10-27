import React from 'react'
import { shallow } from 'enzyme'
import { Link } from 'react-router'
import Questions from 'components/Questions'
import Immutable from 'immutable'

describe('Component::Questions', function(){
  let props;
  beforeEach(function(){
    props = {
      questions: Immutable.fromJS([
        { id: 1, content: 'the-content-1' },
        { id: 2, content: 'the-content-2' }
      ])
    };
  });
  function renderDoc () {
    return shallow(<Questions {...props} />);
  }

  it('renders questions', function(){
    let doc = renderDoc();
    let questionComps = doc.find(Link);

    expect(questionComps.length).to.equal(props.questions.size + 1);
  });

  it('renders "There is not any questions" if no any questions', function(){
    props.questions = Immutable.fromJS([]);
    let doc = renderDoc();

    expect(doc.text()).to.contains("There is not any questions");
  });

  it('do not renders "There is not any questions" if is any questions', function(){
    let doc = renderDoc();

    expect(doc.text()).to.not.contains("There is not any questions");
  });
});
