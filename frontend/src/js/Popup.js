export default class Popup {
  constructor(options) {
    this.class = options.class;
    this.data = options.data;
    this.time = options.time;
    this.limit = options.limit;

    this.left = options.left;
    this.bottom = options.bottom;
    this.indent = options.indent;

    this.bg = options.background;
    this.transitionDuration = options.transitionDuration;

    this.timerId = null;
  }

  createPopup() {
    const div = document.createElement('div');

    if (this.limit <= document.querySelectorAll(`.${this.class}`).length) return;

    this.alignPopups(div);
    div.className = this.class;
    div.innerHTML = this.data;
    div.append(this.addIcon());
    div.style.backgroundColor = this.bg;

    document.body.append(div);

    this.addAnimate(div);
    this.addEvents(div);

    this.timerId = setTimeout(() => {
      this.removeAnimate(div);
      setTimeout(() => {
        this.delItem(div)
      }, this.transitionDuration * 1000)
    }, this.time * 1000 - this.transitionDuration * 1000);
  }

  addAnimate(div) {
    div.style.transitionDuration = `${this.transitionDuration}s`
    div.style.transitionProperty = 'all';
    div.style.opacity = '0';

    setTimeout(() => {
      div.style.opacity = '1';
    }, 10);
  }

  removeAnimate(div) {
    div.style.opacity = '0';
  }

  alignPopups(div = null) {
    const popups = document.querySelectorAll(`.${this.class}`)
    const length = popups.length;

    if (length == 0) return;

    let bottomIndent = 0;
    let padding = this.bottom * (length + 1);
    for (let i = 0; i < length; i++)
      bottomIndent += popups[i].offsetHeight;

    div.style.bottom = `${bottomIndent + padding}px` //+divStyleBottom from css styles
  }

  addEvents(div) {
    const closeBtn = div.querySelector('svg');
    closeBtn.addEventListener('click', () => {
      clearTimeout(this.timerId);
      this.removeAnimate(div);

      setTimeout(() => {
        this.delItem(div)
      }, this.transitionDuration * 1000)
    })
  }

  delItem(div) {
    div.remove();
    const popups = document.querySelectorAll(`.${this.class}`)
    const length = popups.length;

    let bottomIndent = 0;
    let padding = this.bottom * length;

    for (let i = 0; i < length; i++)
      bottomIndent += popups[i].offsetHeight;

    for (let i = 0; i < length; i++)
      popups[length - i - 1].style.bottom = `${bottomIndent - (popups[i].offsetHeight * (i + 1)) + this.bottom * (length - i)}px`
  }

  addIcon() {
    const span = document.createElement('span');
    span.innerHTML = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 496.096 496.096">
     <path d="M259.41,247.998L493.754,13.654c3.123-3.124,3.123-8.188,0-11.312c-3.124-3.123-8.188-3.123-11.312,0L248.098,236.686
       L13.754,2.342C10.576-0.727,5.512-0.639,2.442,2.539c-2.994,3.1-2.994,8.015,0,11.115l234.344,234.344L2.442,482.342
       c-3.178,3.07-3.266,8.134-0.196,11.312s8.134,3.266,11.312,0.196c0.067-0.064,0.132-0.13,0.196-0.196L248.098,259.31
       l234.344,234.344c3.178,3.07,8.242,2.982,11.312-0.196c2.995-3.1,2.995-8.016,0-11.116L259.41,247.998z"/>
  </svg>`;
    return span;
  }
}