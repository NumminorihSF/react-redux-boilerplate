import isArray from 'utils/type/isArray'

describe('Utils::type::isArray', function(){
  let arg;
  function Class(){}
  beforeEach(function(){
    arg = undefined;
  });

  it('return true if is Array', function(){
    arg = [];
    expect(isArray(arg)).to.be.equal(true);
  });

  it('return false if is extended Object', function(){
    arg = new Class();
    expect(isArray(arg)).to.be.equal(false);
  });

  it('return false if is function', function(){
    arg = Class;
    expect(isArray(arg)).to.be.equal(false);
  });

  it('return false if is String', function(){
    arg = '';
    expect(isArray(arg)).to.be.equal(false);
  });

  it('return false if is null', function(){
    arg = null;
    expect(isArray(arg)).to.be.equal(false);
  });

  it('return false if is undefined', function(){
    expect(isArray(arg)).to.be.equal(false);
  });

  it('return false if is Object', function(){
    arg = {};
    expect(isArray(arg)).to.be.equal(false);
  });

  it('return false if is Number', function(){
    arg = 2;
    expect(isArray(arg)).to.be.equal(false);
  });
});
