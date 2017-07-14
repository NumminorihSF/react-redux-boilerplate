import uniqueId from 'utils/uniqueId'

describe('Utils::uniqueId', function(){
  const idStore = new Set();

  it('returns string without arguments', function(){
    expect(typeof uniqueId()).to.be.equal('string');
  });

  it('returns string with number as argument', function(){
    expect(typeof uniqueId(1)).to.be.equal('string');
  });

  it('returns string with string as argument', function(){
    expect(typeof uniqueId('1')).to.be.equal('string');
  });

  it('generate unique ids for 10000 sync calls', function(){
    for(let i = 0; i < 10000; i++) {
      const id = uniqueId();
      if (idStore.has(id)) throw new Error(`"${id}" already is in id's store.`);
      idStore.add(id);
    }
  });

  it('generate unique ids for 10000 async calls', function(){
    const promises = [];
    for(let i = 0; i < 10000; i++) {
      promises.push(new Promise(resolve => setTimeout(()=> {
        const id = uniqueId();
        if (idStore.has(id)) throw new Error(`"${id}" already is in id's store.`);
        idStore.add(id);
        resolve();
      }, 0)));
    }
    return Promise.all(promises);
  });

});
