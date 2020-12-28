const parseData = (container, data, options = {}) => { //array is coming
  container.innerHTML = '';
  if (options.emptyFilter) {
    container.innerHTML = '<b>По вашему фильтру нету подходящих данных!</b>';
    return;
  }
  parseTitles(container, data[0], options);
  data.forEach(obj => {
    let tr = document.createElement('tr');
    console.log(obj)
    for (let key in obj) {
      if (key == 'id' && !options.workers) continue;
      let td = document.createElement('td');
      if (key == 'Выполнен') {
        switch (obj[key]) {
          case 0:
            td.innerHTML = `Нет`;
            break;
          case 1:
            td.innerHTML = `Да`;
            break;
          case 2:
            td.innerHTML = `В процессе`;
            break;
        }
        tr.append(td);
        continue;
      }
      td.innerHTML = `${(obj[key] === null) ? 'не указано' : obj[key]}`;
      tr.append(td);
    }
    tr.setAttribute('id', obj.id);
    if(obj.hasOwnProperty('Id работника')) tr.setAttribute('id', obj['Id работника']);
    if(obj.hasOwnProperty('Id')) tr.setAttribute('id', obj['Id']);
    container.append(tr);
  });
}

const parseTitles = (container, instance, options = {}) => {
  const tr = document.createElement('tr');
  for (let key in instance) {
    if (key == 'id' && !options.workers) continue;
    const th = document.createElement('th');
    th.innerHTML = `${key}`;
    tr.append(th);
  }
  container.prepend(tr);
}

export default parseData;