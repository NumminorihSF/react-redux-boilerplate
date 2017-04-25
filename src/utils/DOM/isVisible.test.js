"use strict";
import jsdom from 'jsdom'
import isVisible from './isVisible';

const oldDocument = document;
const oldWindow = window;
describe('Utils::DOM:isVisible', function(){
  beforeEach(function(){
    global.document = jsdom.jsdom('<html><head id="head"></head><body></body></html>');
    global.window = global.document.defaultView;
  });
  afterEach(function(){
    global.document = oldDocument;
    global.window = oldWindow;
  });

  it('returns true if no arguments', function(){
    expect(isVisible()).to.be.equal(true);
  });

  it('returns true if argument is null', function(){
    expect(isVisible(null)).to.be.equal(true);
  });

  it('returns true if argument is undefined', function(){
    expect(isVisible(undefined)).to.be.equal(true);
  });

  it('returns true if argument is document', function(){
    expect(isVisible(document.documentElement)).to.be.equal(true);
  });

  it('returns true if argument is element without z-index', function(){
    document.body.innerHTML = '<div id="target"></div>';
    const target = document.querySelector('#target');
    expect(isVisible(target)).to.be.equal(true);
  });

  it('returns false if argument is element with display: none by attribute', function(){
    document.body.innerHTML = '<div id="target" style="display: none"></div>';
    const target = document.querySelector('#target');
    expect(isVisible(target)).to.be.equal(false);
  });

  it('returns false if argument is element with display: none by css', function(){
    document.head.innerHTML = '<style>.some-class{display:none}</style>';
    document.body.innerHTML = '<div id="target" class="some-class"></div>';
    const target = document.querySelector('#target');
    expect(isVisible(target)).to.be.equal(false);
  });

  it('returns false if argument is element with parent that has display: none by attribute', function(){
    document.body.innerHTML = '<div style="display: none"><div id="target"></div></div>';
    const target = document.querySelector('#target');
    expect(isVisible(target)).to.be.equal(false);
  });

  it('returns false if argument is element with parent that has display: none by css', function(){
    document.head.innerHTML = '<style>.some-class {display: none}</style>';
    document.body.innerHTML = '<div class="some-class"><div id="target"></div></div>';
    const target = document.querySelector('#target');
    expect(isVisible(target)).to.be.equal(false);
  });

  it('returns false if argument is element with deep parent that has display: none by attribute', function(){
    document.body.innerHTML = '<div style="display: none"><div><div><div id="target"></div></div></div></div>';
    const target = document.querySelector('#target');
    expect(isVisible(target)).to.be.equal(false);
  });

  it('returns false if argument is element with deep parent that has display: none by css', function(){
    document.head.innerHTML = '<style>.some-class {display: none}</style>';
    document.body.innerHTML = '<div class="some-class"><div><div><div id="target"></div></div></div></div>';
    const target = document.querySelector('#target');
    expect(isVisible(target)).to.be.equal(false);
  });

  it('returns true is has not parent with display: none', function(){
    document.head.innerHTML = '<style>.some-class {}</style>';
    document.body.innerHTML = `<div>
<div style="">
<div class="some-class">
<div id="target"></div>
</div>
</div>
</div>`;
    const target = document.querySelector('#target');
    expect(isVisible(target)).to.be.equal(true);
  });
});
