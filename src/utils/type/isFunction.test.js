import isFunction from 'utils/type/isFunction'

describe('Utils::type::isFunction', function(){
  let arg;
  function Class(){}
  class Sec {}
  beforeEach(function(){
    arg = undefined;
  });

  it('return true if is Function', function(){
    arg = function(){};
    expect(isFunction(arg)).to.be.equal(true);
  });

  it('return true if is Arrow Function "()=>{}"', function(){
    arg = ()=>{};
    expect(isFunction(arg)).to.be.equal(true);
  });

  it('return true if is declaratted function with name', function(){
    arg = function name(){};
    expect(isFunction(arg)).to.be.equal(true);
  });

  it('return true if is function created by constructor', function(){
    arg = new Function('a', 'b', '');
    expect(isFunction(arg)).to.be.equal(true);
  });

  it('return true if is class constructor', function(){
    arg = Sec;
    expect(isFunction(arg)).to.be.equal(true);
  });

  it('return false if is Array', function(){
    arg = [];
    expect(isFunction(arg)).to.be.equal(false);
  });

  it('return false if is extended Object', function(){
    arg = new Class();
    expect(isFunction(arg)).to.be.equal(false);
  });

  it('return false if is String', function(){
    arg = '';
    expect(isFunction(arg)).to.be.equal(false);
  });

  it('return false if is null', function(){
    arg = null;
    expect(isFunction(arg)).to.be.equal(false);
  });

  it('return false if is undefined', function(){
    expect(isFunction(arg)).to.be.equal(false);
  });

  it('return false if is Object', function(){
    arg = {};
    expect(isFunction(arg)).to.be.equal(false);
  });

  it('return false if is Number', function(){
    arg = 2;
    expect(isFunction(arg)).to.be.equal(false);
  });
});
