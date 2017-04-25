import isObject from 'utils/type/isObject'

describe('Utils::type::isObject', function(){
  let arg;
  function Class(){}
  beforeEach(function(){
    arg = undefined;
  });

  it('return true if is Object', function(){
    arg = {};
    expect(isObject(arg)).to.be.equal(true);
  });

  it('return true if is extended Object', function(){
    arg = new Class();
    expect(isObject(arg)).to.be.equal(true);
  });

  it('return false if is function', function(){
    arg = Class;
    expect(isObject(arg)).to.be.equal(false);
  });

  it('return false if is String', function(){
    arg = '';
    expect(isObject(arg)).to.be.equal(false);
  });

  it('return false if is null', function(){
    arg = null;
    expect(isObject(arg)).to.be.equal(false);
  });

  it('return false if is undefined', function(){
    expect(isObject(arg)).to.be.equal(false);
  });

  it('return false if is Array', function(){
    arg = [];
    expect(isObject(arg)).to.be.equal(false);
  });

  it('return false if is Number', function(){
    arg = 2;
    expect(isObject(arg)).to.be.equal(false);
  });
});
