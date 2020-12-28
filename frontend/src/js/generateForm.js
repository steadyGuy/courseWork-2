import Popup from "./Popup";
import urlConfig from "./routes/routesConfig";
import routeGetTable from "./routes/routeGetTable";
import selectRoutes from "./routes/selectRoutes";

let defaultPopupObj = {
  class: 'success-popup',
  data: ``,
  time: 6,
  limit: 2,
  left: 20,
  bottom: 20,
  indent: 20,
  background: '#EC5757',
  transitionDuration: 0.4
}
const generateForm = async (index, typeOfForm, request, dataForUpdate, container) => {
  const popupForm = document.querySelector('.popup-form');
  const addFrom = popupForm.querySelector('.form');
  const formTitle = addFrom.querySelector('.head h4');
  const closeBtn = addFrom.querySelector('.close');

  const submitBtn = addFrom.querySelector('button');

  const inputContainer = addFrom.querySelector('ul');
  const form = addFrom.querySelector('form');

  let currentUrl;

  toggleForm(popupForm);

  closeBtn.onclick = (e) => {
    toggleForm(popupForm);
  }

  popupForm.onclick = (e) => {
    if (e.target.classList.contains('popup-form')) toggleForm(popupForm);
  }

  switch (index) { //в зависимости от номера контента - меняется форма
    case '1':
      currentUrl = urlConfig.tablePlans;
      switch (typeOfForm) {
        case 'add':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Добавить план', '#4EA8C9');
          await generateSelect('Работник', inputContainer, urlConfig.tableWorkers, 'workers-list');
          await generateSelect('Продукт', inputContainer, urlConfig.tableItems, 'items-list');
          inputContainer.append(generateInput('Дата', 'date', 'date', 'date', 'plan-date'));
          inputContainer.append(generateInput('Количество', 'Число...', 'text', 'count', 'plan-count'));
          break;
        case 'delete':
          generateTitleAndColor({ formTitle, submitBtn }, 'Удалить план', '#EC5757');
          inputContainer.innerHTML = '';
          await generateSelect('Работник', inputContainer, urlConfig.tableWorkers, 'workers-list');
          await generateSelect('Продукт', inputContainer, urlConfig.tableItems, 'items-list');
          inputContainer.append(generateInput('Дата', 'date', 'date', 'date', 'plan-date'));
          break;
        case 'update':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Обновить план', '#B8B8B8');
          await generateSelect('Работник', inputContainer, urlConfig.tableWorkers, 'workers-list');
          await generateSelect('Продукт', inputContainer, urlConfig.tableItems, 'items-list');
          inputContainer.append(generateInput('Количество', 'Число...', 'text', 'count', 'plan-count-update'));
          inputContainer.append(generateInput('Дата', 'date', 'date', 'date', 'plan-date-update'));
          inputContainer.append(dataForUpdate);
          break;
      }
      break;
    case '2':
      currentUrl = urlConfig.tableDoneProducts;
      switch (typeOfForm) {
        case 'add':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Добавить выполненый продукт', '#4EA8C9');
          await generateSelect('План', inputContainer, urlConfig.tablePlans, 'plans-list');
          inputContainer.append(generateInput('Количество сделанных', 'Число...', 'text', 'count', 'doneProducts-count'));
          generateCheckBoxBtn('План выполнено: ', inputContainer, 'isDone', 'doneProductCheckbox');
          await generateCheckBoxes('Тип брака + количество', inputContainer, urlConfig.tablebadProductsType);
          break;
        case 'delete':
          generateTitleAndColor({ formTitle, submitBtn }, 'Удалить выполненый продукт', '#EC5757');
          inputContainer.innerHTML = '';
          inputContainer.innerHTML = '';
          await generateSelect('Работник', inputContainer, urlConfig.tableWorkers, 'workers-list');
          await generateSelect('Продукт', inputContainer, urlConfig.tableItems, 'items-list');
          inputContainer.append(generateInput('Дата', 'date', 'date', 'date', 'done-product-date'));
          break;
        case 'update':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Обновить выполненый продукт', '#B8B8B8');
          inputContainer.append(generateInput('Количество сделанных продуктов', 'Число...', 'text', 'count', 'doneProducts-employee'));
          inputContainer.append(generateInput('Количество бракованных', 'Число...', 'text', 'countBad', 'doneProducts-badCount-update'));
          await generateSelect('Вид брака', inputContainer, urlConfig.tablebadProductsType, 'bad-product-list');
          // generateCheckBoxBtn('План выполнено: ', inputContainer, 'isDone', 'doneProductCheckbox');
          inputContainer.append(dataForUpdate);
          break;
      }
      break;
    case '3':
      currentUrl = urlConfig.tablebadProducts;
      switch (typeOfForm) {
        case 'add':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Добавить новый брак', '#4EA8C9');
          inputContainer.append(generateInput('Тип брака', 'Введите имя нового типа брака...', 'text', 'badProduct', 'badProduct-bads'));
          break;
        case 'delete':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Удалить тип брака', '#EC5757');
          await generateSelect('Тип брака', inputContainer, urlConfig.tablebadProductsType, 'bad-product-list');
          break;
        case 'update':
          inputContainer.innerHTML = '';
          break;
      }
      break;
    case '4':
      currentUrl = urlConfig.tableWorkers;
      switch (typeOfForm) {
        case 'add':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Добавить работника', '#4EA8C9');
          inputContainer.append(generateInput('Работник', 'Имя, Фамилия через пробел...', 'text', 'employee', 'workers-employee'));
          inputContainer.append(generateInput('Возраст', 'Число...', 'text', 'age', 'workers-age'));
          break;
        case 'delete':
          generateTitleAndColor({ formTitle, submitBtn }, 'Удалить работника', '#EC5757');
          inputContainer.innerHTML = '';
          inputContainer.append(generateInput('Уникальный идентификатор', 'Число...', 'text', 'employee', 'workers-employee'));
          break;
        case 'update':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Обновить продукт', '#B8B8B8');
          inputContainer.append(generateInput('Работник', 'Имя, Фамилия через пробел...', 'text', 'employee', 'workers-employee'));
          inputContainer.append(generateInput('Возраст', 'Число...', 'text', 'age', 'workers-age'));
          inputContainer.append(dataForUpdate); //З ЦИМ Э БАГ, виправи!!!
          break;
      }
      break;
    case '5':
      currentUrl = urlConfig.tableItems;
      switch (typeOfForm) {
        case 'add':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Добавить продукт', '#4EA8C9');
          inputContainer.append(generateInput('Имя продукта', 'Имя продукта...', 'text', 'product', 'product-name'));
          await generateSelect('Фасон', inputContainer, urlConfig.tableFashions, 'fashion-list');
          break;
        case 'delete':
          generateTitleAndColor({ formTitle, submitBtn }, 'Удалить продукт', '#EC5757');
          inputContainer.innerHTML = '';
          inputContainer.append(generateInput('Имя продукта', 'Имя продукта...', 'text', 'product', 'product-name'));
          await generateSelect('Фасон', inputContainer, urlConfig.tableFashions, 'fashion-list');
          break;
        case 'update':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Обновить продукт', '#B8B8B8');
          inputContainer.append(generateInput('Имя продукта', 'Имя продукта...', 'text', 'product', 'product-name'));
          await generateSelect('Фасон', inputContainer, urlConfig.tableFashions, 'fashion-list');
          inputContainer.append(dataForUpdate); //З ЦИМ Э БАГ, виправи!!!
          break;
      }
      break;
    case '6':
      currentUrl = urlConfig.tableFashions;
      switch (typeOfForm) {
        case 'add':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Добавить Фасон', '#4EA8C9');
          inputContainer.append(generateInput('Имя Фасона', 'Имя фасона...', 'text', 'fashion', 'fashion-name-add'));
          inputContainer.append(generateInput('Размер Фасона', 'Число...', 'text', 'size', 'fashion-size-add'));
          break;
        case 'delete':
          generateTitleAndColor({ formTitle, submitBtn }, 'Удалить Фасон', '#EC5757');
          break;
        case 'update':
          inputContainer.innerHTML = '';
          generateTitleAndColor({ formTitle, submitBtn }, 'Обновить продукт', '#B8B8B8');
          inputContainer.append(generateInput('Имя Фасона', 'Имя фасона...', 'text', 'fashion', 'fashion-name-update'));
          inputContainer.append(generateInput('Размер Фасона', 'Число...', 'text', 'size', 'fashion-size-update'));
          inputContainer.append(dataForUpdate); //З ЦИМ Э БАГ, виправи!!!
          break;
      }
      break;
  }

  submitBtn.onclick = async (e) => {
    const dataJson = generateFields(form);
    e.preventDefault();
    try {
      let response = await fetch(request, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: dataJson
      })
      let infoMessage = await response.text();
      if (response.status == 400) {
        new Popup(Object.assign(defaultPopupObj, { background: 'red', data: `<b>Status code: ${response.status}</b><div></div> ${infoMessage}` })).createPopup();
      } else if (response.status >= 200 && response.status <= 226) {
        new Popup(Object.assign(defaultPopupObj, { background: '#26de81', data: `<b>Status code: ${response.status}</b><div></div> ${infoMessage}` })).createPopup();
      }
      toggleForm(popupForm);
      routeGetTable(currentUrl, container);
    } catch (err) {
      new Popup(Object.assign(defaultPopupObj, { background: 'red', data: `<b>Имя ошибки: ${err.name}</b><div></div> ${err.message}` })).createPopup();
    }
  }

}

const generateInput = (labelTitle, placeholder, type, name, id) => {
  const li = document.createElement('li');
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.setAttribute('for', id);
  label.innerHTML = labelTitle;
  input.setAttribute('id', id);
  input.setAttribute('type', type);
  input.setAttribute('name', name);
  if (placeholder == 'date') {
    let date = new Date();
    input.setAttribute('value', `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
    input.setAttribute('min', `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
  } else {
    input.setAttribute('placeholder', placeholder);
  }
  li.append(label);
  li.append(input);

  return li;
}

const generateSelect = async (spanTitle, container, url, routeName) => {
  const select = document.createElement('select');
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.innerText = spanTitle;

  await selectRoutes(url, routeName, select);

  li.append(span);
  li.append(select);
  container.append(li);
}

const generateCheckBoxes = async (spanTitle, container, url) => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.innerText = spanTitle;

  const main = document.createElement('div');
  main.className = 'popup-form__checkbox-list';
  main.onclick = (e) => {
    let target = e.target;
    if (e.target.getAttribute('type') != 'checkbox') return;
    let numberInput = target.parentElement.nextElementSibling.classList;
    numberInput.toggle('hidden');
  }
  let response = await fetch(url);  //urlConfig.tablebadProductsType
  let data = await response.json();

  data.forEach((obj, index) => {
    for (let key in obj) {
      if (key == 'Вид дефекта') {

        main.append(createBadTypeCheckBox(obj[key], index));
      }
    }
    li.append(span);
    li.append(main);
    container.append(li);
  });
  //  generateCheckBoxesFields(main);
}

const generateCheckBoxesFields = (main) => {
  const elements = main.querySelectorAll('input[type="text"]');
  const values = [];
  let obj = {};
  elements.forEach(input => {
    if (!input.classList.contains('hidden')) {
      values.push({value: input.value, type: input.getAttribute('badType')});
    }
  })

  obj['arrCheckBoxes'] = values;
  return obj;
}


const createBadTypeCheckBox = (checkBoxLabel, index) => {
  const div = document.createElement('div');
  div.className = 'popup-form__wrapper';
  const label = document.createElement('label');
  label.setAttribute('for', `bad-type-${index}`)
  label.innerText = checkBoxLabel;

  const checkInput = document.createElement('input');
  checkInput.setAttribute('type', 'checkbox');
  checkInput.setAttribute('id', `bad-type-${index}`);
  checkInput.setAttribute('special', '1');
  label.append(checkInput);

  const numberInput = document.createElement('input')
  numberInput.setAttribute('type', 'text');
  numberInput.setAttribute('placeholder', 'Число...');
  numberInput.classList.add('hidden');
  numberInput.setAttribute('special', '1');
  numberInput.setAttribute('badType', checkBoxLabel);

  div.append(label);
  div.append(numberInput);
  return div;
}

const generateTitleAndColor = ({ formTitle, submitBtn }, title, color) => {
  formTitle.innerHTML = title;
  formTitle.style.background = color;
  submitBtn.innerHTML = title;
  submitBtn.style.background = color;
}

const generateFields = (form) => {
  let mainObj = {};
  let lonelyDiv = form.querySelector('.popup-form__checkbox-list');
  const table = form.querySelector('table');
  if (table) mainObj['id'] = table.rows[1].getAttribute('id');
  for (let i = 0; i < form.elements.length - 1; i++) {
    if (form.elements[i].getAttribute('special') == 1) {
      continue;
    }
    console.log(form.elements[i])
    if (form.elements[i].tagName == 'SELECT') {
      Object.assign(mainObj, generateSelectFields(form.elements[i], mainObj));
      continue;
    }
    if (form.elements[i].getAttribute('type') == 'checkbox' && form.elements[i].checked == true) {
      mainObj[form.elements[i].getAttribute('name')] = 1;
      continue;
    }
    mainObj[form.elements[i].getAttribute('name')] = form.elements[i].value;
  }
  if (lonelyDiv) Object.assign(mainObj, generateCheckBoxesFields(lonelyDiv));
  console.log(JSON.stringify(mainObj))
  return JSON.stringify(mainObj);
}

const generateCheckBoxBtn = (labelTitle, container, name, id) => {
  const li = document.createElement('li');
  const label = document.createElement('label');
  label.innerText = labelTitle;

  let input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('id', id);
  label.setAttribute('for', id);
  label.className = "special_label";
  input.setAttribute('name', name);
  input.setAttribute('checked', true);
  input.setAttribute('value', 0);

  li.append(label);
  li.append(input);

  container.append(li);

}

const generateSelectFields = (select) => {
  let selectObj = {};
  let selected = select.options[select.selectedIndex];
  for (let name of selected.getAttributeNames()) {
    let value = selected.getAttribute(name);
    selectObj[name] = value;
  }
  return selectObj;
}

const toggleForm = (form) => {
  form.classList.toggle('hidden');
}

export default generateForm;