'use strict';

import generateForm from "./generateForm";
import getFilterFields from "./getFilterFields";
import parseData from "./parseData";
import deleteRoute from "./routes/deleteRoute";
import routeGetTable from "./routes/routeGetTable";
import urlConfig from "./routes/routesConfig";
import workWithDate from "./workWithDate";

const url = 'http://localhost:3000';

document.addEventListener("DOMContentLoaded", function (event) {
  const tabs = document.querySelector('.tabs');

  tabs.onclick = async (e) => {
    let target = e.target;
    if (!target) return;
    if (!e.isTrusted) target = tabs.querySelector('input[checked]');

    if (target.tagName != 'INPUT' || !target.dataset.contentIndex) return;
    let contentIndex = target.dataset.contentIndex;
    let mainContent = document.getElementById(`content-${contentIndex}`);
    const table = mainContent.querySelector('.table table');

    const addBtn = mainContent.querySelector('.tab-content__add-btn');
    const trashBtn = mainContent.querySelector('.tab-content__trash-btn');
    const updateBtn = mainContent.querySelector('.tab-content__update-btn');

    let sortListElement = mainContent.querySelector('.dropdown');
    let filterFrom = mainContent.querySelector('.tab-sidebar form');

    const range = document.body.querySelector("input[type='range']")
    range.onchange = () => {
      range.nextElementSibling.innerHTML = range.value + " %";
    }

    workWithDate(filterFrom.querySelector('input[name="dateStart"]'), filterFrom.querySelector('input[name="dateEnd"]'));

    let urlFilter = '';
    let [urlAdd, urlTrash, urlUpdate] = ['', '', ''];
    //url для кнопок add, trash, update
    console.log(contentIndex)
    switch (contentIndex) {
      case '1':
        urlFilter = `${url}/plans-filter`;
        [urlAdd, urlTrash, urlUpdate] = [`${url}/plans-add`, `${url}/plans-delete`, `${url}/plans-update`]
        break;
      case '2':
        urlFilter = `${url}/done-products-filter`;
        [urlAdd, urlTrash, urlUpdate] = [`${url}/done-products-add`, `${url}/done-products-delete`, `${url}/done-products-update`]
        break;
      case '3':
        urlFilter = `${url}/bad-products-filter`;
        [urlAdd, urlTrash, urlUpdate] = [`${url}/bad-products-add`, `${url}/bad-products-delete`, `${url}/bad-products-update`]
        break;
      case '4':
        urlFilter = `${url}/workers-filter`;
        [urlAdd, urlTrash, urlUpdate] = [`${url}/workers-add`, `${url}/workers-delete`, `${url}/workers-update`]
        break;
      case '5':
        urlFilter = `${url}/items-filter`;
        [urlAdd, urlTrash, urlUpdate] = [`${url}/items-add`, `${url}/items-delete`, `${url}/items-update`]
        break;
      case '6':
        urlFilter = `${url}/fashions-filter`;
        [urlAdd, urlTrash, urlUpdate] = [`${url}/fashions-add`, `${url}/fashions-delete`, `${url}/fashions-update`]
        break;
    }

    filterFrom.onsubmit = async (e) => {
      e.preventDefault();
      const json = getFilterFields(filterFrom, contentIndex);
      const response = await fetch(urlFilter, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: json
      });
      const data = await response.json();

      if (!data.length) {
        parseData(table, data, { emptyFilter: true });
        return;
      }
      parseData(table, data);
    }

    addBtn.onclick = async (e) => {
      generateForm(contentIndex, 'add', urlAdd, '', table);
    }

    trashBtn.onclick = async (e) => {
      generateForm(contentIndex, 'delete', urlTrash, '', table);
    }

    table.oncontextmenu = async (e) => {

      e.preventDefault();
      let target = e.target;
      if (target.tagName != 'TD') return;

      if (e.ctrlKey) {
        let isDelete = confirm('Вы уверени что хотите удлать этот элемент?');
        if (isDelete) {
          let objWithId = { specialId: target.parentElement.getAttribute('id') }
          await deleteRoute(contentIndex, urlTrash, table, objWithId);
          return;
          //       generateForm(contentIndex, 'delete', urlTrash, '', table);
        } else {
          return;
        }
      }
      let b = document.createElement('b');
      let tableNew = document.createElement('table');
      let titles = target.parentElement.parentElement.firstElementChild;
      tableNew.append(titles.cloneNode(true));
      tableNew.append(target.parentElement.cloneNode(true));
      tableNew.prepend(b);
      b.innerText = 'Обновляемый элемент';
      generateForm(contentIndex, 'update', urlUpdate, tableNew, table);
    }

    sortListElement.onchange = (e) => {
      sortBy(sortListElement.options[sortListElement.options.selectedIndex].value, sortListElement.getAttribute('name'), table);
    }
    //Отобразить таблицы
    switch (contentIndex) {
      case '1':
        routeGetTable(urlConfig.tablePlans, table);
        break;
      case '2':
        routeGetTable(urlConfig.tableDoneProducts, table);
        break;
      case '3':
        routeGetTable(urlConfig.tablebadProducts, table);
        break;
      case '4':
        routeGetTable(urlConfig.tableWorkers, table);
        break;
      case '5':
        routeGetTable(urlConfig.tableItems, table);
        break;
      case '6':
        routeGetTable(urlConfig.tableFashions, table);
        break;
    }
  }

  let onceClickEvent = new Event("click");
  tabs.dispatchEvent(onceClickEvent, { bubbles: true });

  const sortBy = async (selected, subUrl, container) => {
    let response = await fetch(`${url}/${subUrl}?sort=${selected}`);
    let data = await response.json();
    parseData(container, data);
  }


});

