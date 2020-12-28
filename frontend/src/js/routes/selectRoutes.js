const selectRoutes = async (url, routeName, select) => {
    let response = await fetch(url);
    let data = await response.json();

    switch (routeName) {
        case 'workers-list':
            data.forEach(obj => {
                let option = document.createElement('option');
                for (let key in obj) {
                    if (key == 'Имя') option.innerHTML += `${obj[key]}`;
                    if (key == 'Фамилия') option.innerHTML += ` ${obj[key]} `;
                    if (key == 'Id работника') option.setAttribute("employee", +obj[key]);
                }
                select.append(option);
            });
            break;
        case 'items-list':
            data.forEach(obj => {
                let option = document.createElement('option');
                for (let key in obj) {
                    if (key == 'Продукт') option.innerHTML += `${obj[key]}, `;
                    if (key == 'id') option.setAttribute("itemId", obj[key]);
                    if (key == 'Тип Фасона') option.innerHTML += ` ${obj[key]} `;
                    if (key == 'Размер Фасона') option.innerHTML += ` - размер: ${(obj[key] === null) ? 'не указано' : obj[key]}`;
                }
                select.append(option);
            });
            break;
        case 'fashion-list':
            data.forEach(obj => {
                let option = document.createElement('option');
                for (let key in obj) {
                    if (key == 'Id') {
                        option.innerHTML += `Id: ${obj[key]} | `;
                        option.setAttribute("fashion", obj[key]);
                    }
                    if (key == 'Имя Фасона') option.innerHTML += `${obj[key]} | `;
                    if (key == 'Тип Фасона') option.innerHTML += ` ${obj[key]} `;
                    if (key == 'Размер') option.innerHTML += ` - размер: ${(obj[key] === null) ? 'не указано' : obj[key]}`;
                }
                select.append(option);
            });
            break;
        case 'plans-list':
            data.forEach(obj => {
                let option = document.createElement('option');
                for (let key in obj) {
                    if (key == 'Выполнен' && (obj[key] == 1 || obj[key] == 0)) return;
                    if (key == 'id') {
                        option.setAttribute("planId", +obj[key]);
                        option.innerHTML += `№${obj[key]}`;
                    }
                    if (key == 'Работник') option.innerHTML += ` ${obj[key]}, `;
                    if (key == 'Продукт') option.innerHTML += `${obj[key]}, `;
                    if (key == 'Фасон') option.innerHTML += `${obj[key]}, → `;
                    if (key == 'Количество') option.innerHTML += `${obj[key]}`;
                }
                select.append(option);
            });
            break;
        case 'bad-product-list':
            data.forEach(obj => {
                console.log('herreeeee', obj)
                let option = document.createElement('option');
                for (let key in obj) {
                    if (key == 'Вид дефекта') {
                        option.setAttribute("defectType", obj[key]);
                        option.innerHTML += `${obj[key]}`;
                    }
                }
                select.append(option);
            });
            break;
    }

}

export default selectRoutes;