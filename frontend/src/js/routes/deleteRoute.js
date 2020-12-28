import Popup from "../Popup";
import routeGetTable from "./routeGetTable";
import urlConfig from "./routesConfig";

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

const deleteRoute = async (index, request, container, objWithId) => {

    let currentUrl;

    switch (index) {
        case '1':
            currentUrl = urlConfig.tablePlans;
            break;
        case '2':
            currentUrl = urlConfig.tableDoneProducts;
            break;
        case '4':
            currentUrl = urlConfig.tableWorkers;
            break;
        case '5':
            currentUrl = urlConfig.tableItems;
            break;
        case '6':
            currentUrl = urlConfig.tableFashions;
            break;
    }

    const dataJson = JSON.stringify(objWithId);
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
        routeGetTable(currentUrl, container);
    } catch (err) {
        new Popup(Object.assign(defaultPopupObj, { background: 'red', data: `<b>Имя ошибки: ${err.name}</b><div></div> ${err.message}` })).createPopup();
    }
}

export default deleteRoute;
