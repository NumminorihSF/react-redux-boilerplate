"use strict";
import jsdom from 'jsdom'
import getZIndex from './getZIndex';

const oldDocument = document;
const oldWindow = window;
describe('Utils::DOM:getZIndex', function(){
  beforeEach(function(){
    global.document = jsdom.jsdom('<html><head id="head"></head><body></body></html>');
    global.window = global.document.defaultView;
  });
  afterEach(function(){
    global.document = oldDocument;
    global.window = oldWindow;
  });

  it('returns 1 if no arguments', function(){
    expect(getZIndex()).to.be.equal(1);
  });

  it('returns 1 if argument is null', function(){
    expect(getZIndex(null)).to.be.equal(1);
  });

  it('returns 1 if argument is undefined', function(){
    expect(getZIndex(undefined)).to.be.equal(1);
  });

  it('returns 1 if argument is document', function(){
    expect(getZIndex(document.documentElement)).to.be.equal(1);
  });

  it('returns 1 if argument is element without z-index', function(){
    document.body.innerHTML = '<div id="target"></div>';
    const target = document.querySelector('#target');
    expect(getZIndex(target)).to.be.equal(1);
  });

  it('returns 10 if argument is element with z-index: 10 by attribute', function(){
    document.body.innerHTML = '<div id="target" style="z-index:10"></div>';
    const target = document.querySelector('#target');
    expect(getZIndex(target)).to.be.equal(10);
  });

  it('returns 11 if argument is element with z-index: 11 by css', function(){
    document.head.innerHTML = '<style>.some-class{z-index:11}</style>';
    document.body.innerHTML = '<div id="target" class="some-class"></div>';
    const target = document.querySelector('#target');
    expect(getZIndex(target)).to.be.equal(11);
  });

  it('returns 12 if argument is element with parent that has z-index: 12 by attribute', function(){
    document.body.innerHTML = '<div style="z-index:12"><div id="target"></div></div>';
    const target = document.querySelector('#target');
    expect(getZIndex(target)).to.be.equal(12);
  });

  it('returns 13 if argument is element with parent that has z-index: 13 by css', function(){
    document.head.innerHTML = '<style>.some-class {z-index:13}</style>';
    document.body.innerHTML = '<div class="some-class"><div id="target"></div></div>';
    const target = document.querySelector('#target');
    expect(getZIndex(target)).to.be.equal(13);
  });

  it('returns 14 if argument is element with deep parent that has z-index: 14 by attribute', function(){
    document.body.innerHTML = '<div style="z-index:14"><div><div><div id="target"></div></div></div></div>';
    const target = document.querySelector('#target');
    expect(getZIndex(target)).to.be.equal(14);
  });

  it('returns 15 if argument is element with deep parent that has z-index: 15 by css', function(){
    document.head.innerHTML = '<style>.some-class {z-index:15}</style>';
    document.body.innerHTML = '<div class="some-class"><div><div><div id="target"></div></div></div></div>';
    const target = document.querySelector('#target');
    expect(getZIndex(target)).to.be.equal(15);
  });

  it('returns max z-index that found in process of boubling', function(){
    document.head.innerHTML = '<style>.some-class {z-index:15}</style>';
    document.body.innerHTML = `<div style="z-index:14">
<div style="z-index:123">
<div class="some-class">
<div id="target"></div>
</div>
</div>
</div>`;
    const target = document.querySelector('#target');
    expect(getZIndex(target)).to.be.equal(123);
  });
});
