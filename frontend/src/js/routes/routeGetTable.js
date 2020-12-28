import parseData from "../parseData";

const routeGetTable = async (url, container, options = {}) => {
    let response = await fetch(url);
    let data = await response.json();
    parseData(container, data, options);
}

export default routeGetTable;