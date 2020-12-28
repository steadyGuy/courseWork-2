const Router = require('koa-router');
const router = new Router(); //{prefix: '/api'}
const mysql = require('mysql2');
const { query } = require('winston');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  database: 'defectiveProducts',
  timezone: 'Z',
  password: 'root'
}).promise();

connection.connect((err) => {
  if (err) {
    return console.log(`Ошибка ${err.message}`)
  } else {
    console.log("Подключение к серверу MySQL успешно установлено");
  }
})

router.get('/done-products', async (ctx, next) => {
  const sortQuery = ctx.query.sort;
  let query = `
  SELECT d.id, concat(firstname,' ',lastname) as Работник, i.productName as Продукт, f.fashionName as Фасон, d.count as Количество, p.dataPlanned as Дата
  FROM doneProducts as d
  JOIN plans as p ON d.planId = p.id 
  JOIN workers as w ON w.id = p.workerId 
  JOIN items as i ON p.itemId = i.id
  JOIN fashions as f ON i.fashionId = f.id`
  switch (sortQuery) {
    case 'fashion':
      query += ` ORDER BY Фасон`;
      break;
    case 'count':
      query += ` ORDER BY Количество`;
      break;
    case 'product':
      query += ` ORDER BY Продукт`;
      break;
    case 'date':
      query += ` ORDER BY Дата`;
      break;
    case 'employee':
      query += ` ORDER BY Работник`;
      break;
  }
  let [data] = await connection.query(query)
  let convertedObj = convertToNormalData(data);
  generateGoodMsg(ctx, JSON.stringify(convertedObj, null, 2))
})

router.post('/done-products-filter', async (ctx, next) => {
  const { employee, product, dateStart, dateEnd } = ctx.request.body;

  const employeeFullName = employee.split(' ');
  let joinQuery = `
  SELECT concat(w.firstname,' ',w.lastname) as Работник, i.productName as Продукт, f.fashionName as Фасон, d.count as Количество, p.dataPlanned as Дата
  FROM doneProducts as d
  JOIN plans as p ON d.planId = p.id
  JOIN workers as w ON p.workerId = w.id ${((employeeFullName.length == 2)) ? `and (w.firstname = '${employeeFullName[0]}' and w.lastname = '${employeeFullName[1]}')` : ''}
  JOIN items as i ON p.itemId = i.id ${product != '' ? ` and i.productName = '${product}'` : ''}
  JOIN fashions as f ON fashionId = f.id and p.itemId = i.id
  ${(dateStart != '' || dateEnd != '') ? `WHERE DATE(dataPlanned) BETWEEN '${dateStart}' and '${dateEnd}'` : ''}
  ORDER BY d.count;`
  console.log(joinQuery)
  try {
    let [data] = await connection.query(joinQuery)
    let obj = convertToNormalData(data);
    generateGoodMsg(ctx, JSON.stringify(obj, null, 2))
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }

})

router.post('/done-products-add', async (ctx, next) => {
  console.log(ctx.request.body);
  const { isDone, planid, count, arrCheckBoxes } = ctx.request.body;

  let arrOfBadTypes = arrCheckBoxes;

  let query1 = `INSERT doneProducts(planId, count) VALUES
  (${+planid}, ${+count});`

  let query2 = `UPDATE plans SET isDone = ${isDone} WHERE id = (SELECT planId FROM doneProducts WHERE planId = ${planid});`
  try {
    console.log(query1, query2);
    let [data1] = await connection.query(query1);
    let [data2] = await connection.query(query2);
    generateGoodMsg(ctx, "Успешно добавлено!");
  } catch (err) {
    generateMsgOnErrorCode(err, ctx)
  }
  try {
    for (let i = 0; i < arrCheckBoxes.length; i++) {
      let query3 = `INSERT badProducts(defectType, defectivePercent, count, doneProductId)
      VALUES
      ('${arrOfBadTypes[i].type}', (${+arrOfBadTypes[i].value} / (SELECT count FROM doneProducts WHERE doneProducts.planId = ${planid})*100), ${+arrOfBadTypes[i].value}, 
      (SELECT id FROM doneProducts WHERE planId = ${planid}));`
      let [data3] = await connection.query(query3);
      console.log(query3);
      generateGoodMsg(ctx, "Успешно добавлено!");
    }
  } catch (err) {
    generateMsgOnErrorCode(err, ctx)
  }
})

router.post('/done-products-delete', async (ctx, next) => {
  const { specialId } = ctx.request.body;
  let query = `DELETE FROM doneProducts WHERE id = ${specialId};`
  console.log(query);
  try {
    let [data] = await connection.query(query)
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    const rows = JSON.parse(JSON.stringify(data, null, 2)).affectedRows;
    if (rows > 0) {
      generateGoodMsg(ctx, `Успешно удалено ${rows} элементов`);
    } else {
      generateGoodMsg(ctx, `Не было удалено ни одного элемента!`);
    }
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

router.post('/done-products-update', async (ctx, next) => {
  console.log(ctx.request.body)
  const { defecttype, count, countBad, id, isDone } = ctx.request.body;
  //let query0 = `UPDATE plans as p SET isDone = ${isDone} WHERE (SELECT planId FROM doneProducts WHERE id =)p.id = ${id};`
  let query1 = `UPDATE doneProducts as d SET d.count = ${count} WHERE d.id = ${id};`
  let query2 = `UPDATE badProducts as b SET b.defectType = '${defecttype}', b.count = ${countBad},
  defectivePercent = ${+countBad} / ${count * 100}
  WHERE b.id = ${id};`
  try {
    console.log(query1, query2)
    let [data1] = await connection.query(query1)
    let [data2] = await connection.query(query2)
    generateGoodMsg(ctx, `Данные успешно обновлены в таблице продуктов!`)
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

router.get('/workers', async (ctx, next) => {

  const sortQuery = ctx.query.sort;
  let query = `
  SELECT id as "Id работника", firstName as Имя, lastName as Фамилия, age as Возраст FROM workers
  `;

  switch (sortQuery) {
    case 'workers-name':
      query += ` ORDER BY firstName;`;
      break;
    case 'workers-surname':
      query += ` ORDER BY lastName;`;
      break;
    case 'workers-age':
      query += ` ORDER BY age;`;
      break;
    case 'workers-id':
      query += ` ORDER BY id;`;
      break;
  }

  let [data] = await connection.query(query)
  console.log(query);
  ctx.status = 200;
  ctx.set('Content-Type', 'application/json;charset=utf-8');
  ctx.body = JSON.stringify(data, null, 2);
})

router.post('/workers-filter', async (ctx, next) => {
  const { surname, age } = ctx.request.body;
  let query = `
  SELECT id as "Id работника", firstName as Имя, lastName as Фамилия, age as Возраст FROM workers `

  if (surname == '' && age != '') {
    query += `WHERE age = ${age} ORDER BY lastname;`
  } else if (age == '' && surname != '') {
    query += `WHERE lastname = '${surname}' ORDER BY lastname;`
  } else if (age !== '' && surname != '') {
    query += `WHERE age = ${age} and lastname = '${surname}' ORDER BY lastname;`
  } else {
    return;
  }
  console.log(query)
  try {
    let [data] = await connection.query(query)
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    ctx.body = JSON.stringify(data, null, 2);
  } catch (err) {
    ctx.status = 500;
    console.log(err.message);
  }

})

router.post('/workers-add', async (ctx, next) => {
  const { employee, age } = ctx.request.body;

  const employeeFullName = employee.split(' ');
  console.log(age)
  if (employeeFullName.length != 2 || (age < 18 || age > 65)) {
    ctx.throw(400, 'Некорректные ввод полей!')
  }
  let query = `INSERT workers(firstName, lastName, age) VALUES ('${employeeFullName[0]}','${employeeFullName[1]}', ${age});`
  try {
    let [data] = await connection.query(query)
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    ctx.body = `Данные успешно добавлены в таблицу продуктов!`;
  } catch (err) {
    err.status = 400;
    errr.code = "ER_PARSE_ERROR";
    generateMsgOnErrorCode(err, ctx);
  }
})

router.post('/workers-delete', async (ctx, next) => {
  console.log(ctx.request.body);
  const { employee, specialId } = ctx.request.body;

  let query;
  if (specialId) {
    query = `DELETE FROM workers WHERE id = ${specialId};`
  } else {
    query = `DELETE FROM workers WHERE id = ${employee};`
  }

  try {
    let [data] = await connection.query(query)
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    const rows = JSON.parse(JSON.stringify(data, null, 2)).affectedRows;
    if (rows > 0) {
      generateGoodMsg(ctx, `Успешно удалено ${rows} элементов`);
    } else {
      ctx.status = 200;
      ctx.set('Content-Type', 'application/json;charset=utf-8');
      ctx.body = "Не было удалено ни одного элемента!";
    }
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

router.post('/workers-update', async (ctx, next) => {
  const { employee, age, id } = ctx.request.body;

  const employeeFullName = employee.split(' ');
  console.log(age)
  if (employeeFullName.length != 2 || (age < 18 || age > 65)) {
    ctx.throw(400, 'Некорректные ввод полей!')
  }
  let query = `UPDATE workers SET firstName = '${employeeFullName[0]}', lastName = '${employeeFullName[1]}', age = ${age}
  WHERE id = ${id};`
  try {
    await connection.query(query)
    generateGoodMsg(ctx, "Данные успешно обновлены!");
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

router.get('/plans', async (ctx, next) => {
  const sortQuery = ctx.query.sort;
  let query = `
  SELECT id,
  (SELECT concat(firstname,' ',lastname) FROM workers WHERE plans.workerId = workers.id) as Работник,
  (SELECT productName FROM items WHERE plans.itemId = items.id) as Продукт,
  (SELECT fashionName FROM fashions 
  WHERE (SELECT fashionId FROM items WHERE fashionId = fashions.id and plans.itemId = items.id)) as Фасон,
  count as Количество, 
  dataPlanned as Дата,
  isDone as Выполнен
  FROM plans
  `;

  switch (sortQuery) {
    case 'plan-fashion':
      query += ` ORDER BY Фасон`;
      break;
    case 'plan-count':
      query += ` ORDER BY Количество`;
      break;
    case 'plan-product':
      query += ` ORDER BY Продукт`;
      break;
    case 'plan-date':
      query += ` ORDER BY Дата`;
      break;
    case 'plan-employee':
      query += ` ORDER BY Работник`;
      break;
  }

  let [data] = await connection.query(query)
  let convertedObj = convertToNormalData(data);
  generateGoodMsg(ctx, JSON.stringify(convertedObj, null, 2))
})

router.post('/plans-filter', async (ctx, next) => {
  const { employee, product, dateStart, dateEnd, isDone0, isDone1, isDone2 } = ctx.request.body;

  const employeeFullName = employee.split(' ');
  let joinQuery = `
  SELECT concat(firstname,' ',lastname) as Работник, productName as Продукт, fashionName as Фасон, count as Количество, dataPlanned as Дата, isDone as Выполнен
  FROM plans
  JOIN workers ON plans.workerId = workers.id ${((employeeFullName.length == 2)) ? `and (workers.firstname = '${employeeFullName[0]}' and workers.lastname = '${employeeFullName[1]}')` : ''}
  JOIN items ON plans.itemId = items.id ${product != '' ? ` and items.productName = '${product}'` : ''}
  JOIN fashions ON fashionId = fashions.id and plans.itemId = items.id
  WHERE isDone IN (${!isDone0 ? '-1' : '0'},${!isDone1 ? '-1' : '1'},${!isDone2 ? '-1' : '2'}) 
  ${(dateStart != '' || dateEnd != '') ? ` and DATE(dataPlanned) BETWEEN '${dateStart}' and '${dateEnd}'` : ''}
  ORDER BY Количество;`
  console.log(joinQuery)
  try {
    let [data] = await connection.query(joinQuery)
    let obj = convertToNormalData(data);
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    ctx.body = JSON.stringify(obj, null, 2);
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }

})

router.post('/plans-add', async (ctx, next) => {
  const { date, employee, count, itemid } = ctx.request.body;
  let query = `INSERT plans(count, workerId, itemId, dataPlanned) VALUES
  (${count}, (SELECT id FROM workers WHERE id = ${+employee}), 
  (SELECT id FROM items WHERE id = ${itemid}), '${date}');`
  console.log(query)
  try {
    let [data] = await connection.query(query)
    generateGoodMsg(ctx, "Элемент успешно добавлен в таблицу!");
  } catch (err) {
    generateMsgOnErrorCode(err, ctx)
  }
})

router.post('/plans-delete', async (ctx, next) => {
  const { date, employee, itemid, specialId } = ctx.request.body;
  let query;
  if (specialId) {
    query = `DELETE FROM plans WHERE id = ${specialId};`
  } else {
    query = `DELETE FROM plans WHERE
    workerId = (SELECT id FROM workers WHERE id = ${+employee}) and
    itemId = (SELECT id FROM items WHERE id = ${itemid}) and dataPlanned = '${date}';`
  }
  console.log(query);
  try {
    let [data] = await connection.query(query)
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    const rows = JSON.parse(JSON.stringify(data, null, 2)).affectedRows;
    if (rows > 0) {
      generateGoodMsg(ctx, `Успешно удалено ${rows} элементов`);
    } else {
      ctx.status = 200;
      ctx.set('Content-Type', 'application/json;charset=utf-8');
      ctx.body = "Не было удалено ни одного элемента!";
    }
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

router.post('/plans-update', async (ctx, next) => {
  /*
  Перш ніж обновити дані в справочнику, треба перевірити, чи не використовуються вони в таблиці doneProducts і подібних
  */
  const { employee, itemid, count, date, id } = ctx.request.body;
  let query = `UPDATE plans as p SET p.itemId = ${itemid}, p.workerId = ${employee}, p.count = ${count}, p.dataPlanned = '${date}'
  WHERE p.id = ${id};`
  try {
    let [data] = await connection.query(query)
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    ctx.body = `Данные успешно обновлены в таблице продуктов!`;
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

router.get('/bad-products', async (ctx, next) => {
  const sortQuery = ctx.query.sort;
  console.log(sortQuery);
  let query = `
  SELECT i.productName as Продукт, f.fashionName as Фасон, 
  SUM(p.count) as Планировано, SUM(d.count) as Сделано, SUM(b.count) as Браковано, b.defectivePercent as "% брака", b.defectType as "Вид дефекта", p.dataPlanned as 'Дата'
  FROM badProducts as b
  JOIN doneProducts as d ON b.doneProductId = d.id
  JOIN plans as p ON  p.id = d.planId
  JOIN items as i ON p.itemId = i.id
  JOIN fashions as f ON i.fashionId = f.id and p.itemId = i.id
  GROUP BY p.itemId, b.defectType
  `;

  switch (sortQuery) {
    case 'bad-count':
      query += ` ORDER BY b.count`;
      break;
    case 'plan-count':
      query += ` ORDER BY p.count`;
      break;
    case 'product':
      query += ` ORDER BY i.productName`;
      break;
    case 'date':
      query += ` ORDER BY p.dataPlanned`;
      break;
  }

  console.log(query)
  let [data] = await connection.query(query)
  let convertedObj = convertToNormalData(data);
  generateGoodMsg(ctx, JSON.stringify(convertedObj, null, 2))

})

router.post('/bad-products-filter', async (ctx, next) => {
  console.log(ctx.request.body)
  const { percent, product, dateStart, dateEnd } = ctx.request.body;
  let joinQuery = `
  SELECT i.productName as Продукт, f.fashionName as Фасон, 
  SUM(p.count) as Планировано, SUM(d.count) as Сделано, SUM(b.count) as Браковано, b.defectivePercent as "% брака", b.defectType as "Вид дефекта", p.dataPlanned as 'Дата'
  FROM badProducts as b
  JOIN doneProducts as d ON b.doneProductId = d.id
  JOIN plans as p ON  p.id = d.planId
  JOIN items as i ON p.itemId = i.id ${product != '' ? ` and i.productName = '${product}'` : ''}
  JOIN fashions as f ON i.fashionId = f.id and p.itemId = i.id
  ${(dateStart != '' || dateEnd != '') ? ` WHERE DATE(p.dataPlanned) BETWEEN '${dateStart}' and '${dateEnd}'` : ''}
  GROUP BY p.itemId, b.defectType
  HAVING SUM(b.defectivePercent) BETWEEN 0 and ${percent}
  ORDER BY b.count
  `
  console.log(joinQuery)
  try {
    let [data] = await connection.query(joinQuery)
    let obj = convertToNormalData(data);
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    ctx.body = JSON.stringify(obj, null, 2);
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }

})

router.post('/bad-products-add', async (ctx, next) => {
  const { badProduct } = ctx.request.body;

  let query = `INSERT defectsType(defectName) VALUES
  ('${badProduct}');`
  console.log(query)
  try {
    let [data] = await connection.query(query)
    generateGoodMsg(ctx, "Элемент успешно добавлен в таблицу!");
  } catch (err) {
    generateMsgOnErrorCode(err, ctx)
  }

})

router.post('/bad-products-delete', async (ctx, next) => {
  const { defecttype } = ctx.request.body;
  let query = `DELETE FROM defectsType WHERE defectName = '${defecttype}';`
  console.log(query);
  try {
    let [data] = await connection.query(query)
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    const rows = JSON.parse(JSON.stringify(data, null, 2)).affectedRows;
    if (rows > 0) {
      generateGoodMsg(ctx, `Успешно удалено ${rows} элементов`);
    } else {
      ctx.status = 200;
      ctx.set('Content-Type', 'application/json;charset=utf-8');
      ctx.body = "Не было удалено ни одного элемента!";
    }
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

router.get('/items', async (ctx, next) => {
  const sortQuery = ctx.query.sort;
  let query = `
  SELECT items.id, productName as Продукт, fashions.id as 'Id-Фасона', fashions.fashionName as 'Тип Фасона', fashions.size as 'Размер Фасона'
  FROM items
  JOIN fashions ON items.fashionId = fashions.id
  `;

  switch (sortQuery) {
    case 'fashion':
      query += ` ORDER BY fashions.fashionName`;
      break;
    case 'product':
      query += ` ORDER BY productName`;
      break;
    case 'fashion-size':
      query += ` ORDER BY fashions.size`;
      break;
    case 'fashion-id':
      query += ` ORDER BY fashions.id`;
      break;
  }

  try {
    let [data] = await connection.query(query)
    generateGoodMsg(ctx, JSON.stringify(data, null, 2))
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

router.post('/items-filter', async (ctx, next) => {
  const { product, size, fashion } = ctx.request.body;
  let query = `
  SELECT productName as Продукт, fashions.id as 'Id-Фасона', fashions.fashionName as 'Тип Фасона', fashions.size as 'Размер Фасона'
  FROM items
  JOIN fashions ON items.fashionId = fashions.id 
  ${size != 'none' ? ` and fashions.size = ${size}` : ''}
  ${fashion != 'none' ? ` and fashions.fashionName = '${fashion}'` : ''}
  ${product != '' ? `WHERE productName = '${product}'` : ''}
  ORDER BY fashions.id;`
  console.log(query)
  try {
    let [data] = await connection.query(query)
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    ctx.body = JSON.stringify(data, null, 2);
  } catch (err) {
    ctx.status = 500;
    console.log(err.message);
  }

})

router.post('/items-add', async (ctx, next) => {
  const { product, fashion } = ctx.request.body;
  let query = `INSERT items(productName, fashionId) VALUES ('${product}', ${fashion});`
  try {
    await connection.query(query)
    generateGoodMsg(ctx, `Данные успешно добавлены в таблицу продуктов!`)
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

router.post('/items-update', async (ctx, next) => {
  const { product, fashion, id } = ctx.request.body;
  let query = `UPDATE items SET productName = '${product}', fashionId = ${fashion}
  WHERE items.id = ${id}`
  try {
    await connection.query(query)
    generateGoodMsg(ctx, `Данные успешно обновлены в таблице продуктов!`);
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

router.post('/items-delete', async (ctx, next) => {
  const { product, fashion, specialId } = ctx.request.body;
  let query;
  if (specialId) {
    query = `DELETE FROM items WHERE id = ${specialId};`
  } else {
    query = `DELETE FROM items WHERE productName = '${product}' and fashionId = ${+fashion};`
  }

  try {
    let [data] = await connection.query(query)
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    const rows = JSON.parse(JSON.stringify(data, null, 2)).affectedRows;
    if (rows > 0) {
      generateGoodMsg(ctx, `Успешно удалено ${rows} элементов`);
    } else {
      generateGoodMsg(ctx, `Не было удалено ни одного элемента!`);
    }
  } catch (err) {
    console.log(err.code)
    console.log(err.message)
    generateMsgOnErrorCode(err, ctx);
  }
})

router.get('/bad-products-type', async (ctx, next) => {
  const query = `SELECT defectName as "Вид дефекта" FROM defectsType;`
  try {
    let [data] = await connection.query(query)
    generateGoodMsg(ctx, JSON.stringify(data, null, 2));
  } catch (err) {
    generateMsgOnErrorCode(ctx, "Не удалось получить элементы!");
  }

})

router.get('/fashions', async (ctx, next) => {
  const sortQuery = ctx.query.sort;
  console.log(sortQuery)
  let query = `
  SELECT id as 'Id', fashionName as "Имя Фасона", size as 'Размер'
  FROM fashions
  `;

  switch (sortQuery) {
    case 'fashion-id':
      query += ` ORDER BY id`;
      break;
    case 'name':
      query += ` ORDER BY fashionName`;
      break;
    case 'size':
      query += ` ORDER BY size`;
      break;
  }
  try {
    let [data] = await connection.query(query)
    generateGoodMsg(ctx, JSON.stringify(data, null, 2))
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }

})

router.post('/fashions-filter', async (ctx, next) => {
  const { fashion } = ctx.request.body;
  let query = `
  SELECT id as 'Id', fashionName as "Имя Фасона", size as 'Размер'
  FROM fashions
  ${fashion == '' ? '' : `WHERE fashionName = '${fashion}'`}
  ORDER BY id;`
  console.log(query)
  try {
    let [data] = await connection.query(query)
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    ctx.body = JSON.stringify(data, null, 2);
  } catch (err) {
    generateMsgOnErrorCode(err, ctx)
  }

})

router.post('/fashions-add', async (ctx, next) => {
  const { size, fashion } = ctx.request.body;
  let query = `INSERT fashions(size, fashionName) VALUES (${size}, '${fashion}');`
  try {
    await connection.query(query)
    generateGoodMsg(ctx, `Данные успешно добавлены в таблицу фасонов!`)
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

router.post('/fashions-delete', async (ctx, next) => {
  const { specialId } = ctx.request.body;
  let query = `DELETE FROM fashions WHERE id = ${specialId};`

  try {
    let [data] = await connection.query(query)
    ctx.status = 200;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    const rows = JSON.parse(JSON.stringify(data, null, 2)).affectedRows;
    if (rows > 0) {
      generateGoodMsg(ctx, `Успешно удалено ${rows} элементов`);
    } else {
      generateGoodMsg(ctx, `Не было удалено ни одного элемента!`);
    }
  } catch (err) {
    console.log(err.code)
    console.log(err.message)
    generateMsgOnErrorCode(err, ctx);
  }
})

router.post('/fashions-update', async (ctx, next) => {
  const { size, fashion, id } = ctx.request.body;
  let query = `UPDATE fashions SET size = ${size}, fashionName = '${fashion}'
  WHERE id = ${id}`
  try {
    await connection.query(query)
    generateGoodMsg(ctx, `Данные успешно обновлены в таблице фасонов!`);
  } catch (err) {
    generateMsgOnErrorCode(err, ctx);
  }
})

const generateMsgOnErrorCode = async (err, ctx) => {
  console.log(err);
  switch (err.code) {
    case "ER_ROW_IS_REFERENCED_2":
      ctx.status = 400;
      ctx.body = "Этот элемент уже используеться в базе!";
      ctx.message = 'Bad Request!';
      break;
    case "ER_DUP_ENTRY":
      ctx.status = 400;
      ctx.body = "Подобный элемент уже существует или используется!";
      ctx.message = 'Bad Request!';
      break;
    case "ER_PARSE_ERROR":
      ctx.status = 400;
      ctx.body = "Некорректный ввод полей!";
      ctx.message = 'Bad Request!';
      break;
    default:
      ctx.status = 500;
      ctx.message = 'Internal Error!';
      break;
  }
}

const generateGoodMsg = async (ctx, msg) => {
  ctx.status = 200;
  ctx.set('Content-Type', 'application/json;charset=utf-8');
  ctx.body = msg;
}

const convertToNormalData = (data) => {
  let obj = JSON.parse(JSON.stringify(data, null, 2));
  for (let i = 0; i < data.length; i++) {
    obj[i]['Дата'] = obj[i]['Дата'].slice(0, 10);
  }
  return obj;
}

module.exports = router;