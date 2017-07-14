import triggerValueInList from 'utils/triggerValueInList'

describe('Utils::triggerValueInList', function(){
  let arg;

  beforeEach(function(){
    arg = [1, 2, 3];
  });

  it('removes existed value', function(){
    expect(triggerValueInList(arg, 1)).to.be.deep.equal([2, 3]);
  });

  it('append extra value', function(){
    expect(triggerValueInList(arg, 4)).to.be.deep.equal([1, 2, 3, 4]);
  });

  it('throws on argument has value', function(){
    const method = () => {
      triggerValueInList([1, 2, 1], 1);
    };
    expect(method).to.throw(Error);
  });
});
