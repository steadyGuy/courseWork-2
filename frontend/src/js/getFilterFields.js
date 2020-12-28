const getFilterFields = (form, index) => {

  switch (index) {
    case '1':
      var employee = form.employee.value;
      if (employee.indexOf(' ') == 0) alert('Incorrect data in employee');
      var [dateStart, dateEnd, product] = [form.dateStart.value, form.dateEnd.value, form.products.value];
      if (form.isDone0.checked) var isDone0 = form.isDone0.value;
      if (form.isDone1.checked) var isDone1 = form.isDone1.value;
      if (form.isDone2.checked) var isDone2 = form.isDone2.value;
      return JSON.stringify({ employee, dateStart, dateEnd, product, isDone1, isDone0, isDone2 });
    case '2':
      console.log(form.employee.value)
      var employee = form.employee.value;
      if (employee.indexOf(' ') == 0 || employee.indexOf == -1) alert('Incorrect data in employee');
      var [dateStart, dateEnd, product] = [form.dateStart.value, form.dateEnd.value, form.products.value];
      return JSON.stringify({ employee, dateStart, dateEnd, product });
    case '3':
      var [dateStart, dateEnd, percent, product] = [form.dateStart.value, form.dateEnd.value, form.percent.value, form.products.value];
      // for (let i = 0; i < form.elements.length; i++) {
      //   console.log("INFO",form.elements[i].name)
      // }
      return JSON.stringify({ product, dateStart, dateEnd, percent });
    case '4':
      var [age, surname] = [form.age.value, form.surname.value];
      return JSON.stringify({ age, surname });
    case '5':
      var [product, size, fashion] = [form.product.value, form.optionsSize.value, form.optionsType.value];
      return JSON.stringify({ product, size, fashion });
    case '6':
      var [fashion] = [form.fashion.value];
      return JSON.stringify({ fashion });
  }
}



export default getFilterFields;