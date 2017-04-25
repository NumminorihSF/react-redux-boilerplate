import isRegExp from 'utils/type/isRegExp'

describe('Utils::type::isRegExp', function(){
  let arg;
  function Class(){}
  beforeEach(function(){
    arg = undefined;
  });

  it('return false if is Object', function(){
    arg = {};
    expect(isRegExp(arg)).to.be.equal(false);
  });

  it('return false if is extended Object', function(){
    arg = new Class();
    expect(isRegExp(arg)).to.be.equal(false);
  });

  it('return false if is function', function(){
    arg = Class;
    expect(isRegExp(arg)).to.be.equal(false);
  });

  it('return false if is String', function(){
    arg = '';
    expect(isRegExp(arg)).to.be.equal(false);
  });

  it('return false if is null', function(){
    arg = null;
    expect(isRegExp(arg)).to.be.equal(false);
  });

  it('return false if is undefined', function(){
    expect(isRegExp(arg)).to.be.equal(false);
  });

  it('return false if is Array', function(){
    arg = [];
    expect(isRegExp(arg)).to.be.equal(false);
  });

  it('return false if is Number', function(){
    arg = 2;
    expect(isRegExp(arg)).to.be.equal(false);
  });

  it('return true if is inline RegExp', function(){
    arg = /123/;
    expect(isRegExp(arg)).to.be.equal(true);
  });

  it('return true if is constructed RegExp', function(){
    arg = new RegExp('q123');
    expect(isRegExp(arg)).to.be.equal(true);
  });
});
