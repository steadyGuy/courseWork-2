const workWithDate = (filterFormDataStart, filterFormDataEnd) => {
    if (filterFormDataStart || filterFormDataEnd) {
        let date = new Date();
   //     filterFormDataEnd.setAttribute('max', `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
      //  filterFormDataStart.setAttribute('max', `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);

        filterFormDataStart.onchange = () => {
            filterFormDataEnd.setAttribute('min', filterFormDataStart.value);
        }
    }
}

export default workWithDate;