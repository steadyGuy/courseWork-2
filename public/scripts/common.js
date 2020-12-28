'use strict';

const workersBtn = document.getElementById('getWorkers');
const fashionsBtn = document.getElementById('getFashions');
const contentContainer = document.querySelector('.list-content');
const preloader = document.querySelector('.preloader');

const parseData = (data, options = {}) => { //array is coming
  contentContainer.innerHTML = '';
  data.forEach(obj => {
    let div = document.createElement('div');
    let title = document.createElement('span');
    for (let key in obj) {
      let span = document.createElement('span');
      span.innerHTML = `<b>${key}:</b> ${obj[key]}`;
      div.append(span);
    }
    preloader.classList.add('hidden');
    contentContainer.append(div);
  });
}

workersBtn.onclick = async (e) => {
  try {
    preloader.classList.toggle("hidden");
    const response = await fetch('/workers');
    await new Promise(resolve => {
      setTimeout(() => {
        resolve('asdsad');
      }, 500);
    });
    const data = await response.json();
    parseData(data);
  } catch (err) {
    if (err) {
      console.log(err.message);
    }
  }
}

fashionsBtn.onclick = async (e) => {
  try {
    preloader.classList.toggle("hidden");
    const response = await fetch('/fashions');
    await new Promise(resolve => {
      setTimeout(() => {
        resolve('asdsad');
      }, 500);
    });
    const data = await response.json();

    parseData(data);
  } catch (err) {
    if (err) {
      console.log(err.message);
    }
  }
}