(function() {

  document.addEventListener('DOMContentLoaded', function() {

    // только кириллица в имени  
    const nameField = document.getElementById('name');
    if (nameField) {
        nameField.addEventListener('input', function() {
        this.value = this.value.replace(/[^А-Яа-яЁё\s-]/g, '');
        });
    }

    // маска для телефона
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        IMask(phoneField, {
            mask: '+{7} (000) 000-00-00'
        });
    }

    // запрет даты в прошлом
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const dateFrom = document.getElementById('date_from');
    const dateTo = document.getElementById('date_to');

    if (dateFrom) dateFrom.min = todayStr;
    if (dateTo) dateTo.min = todayStr;


  });

})();