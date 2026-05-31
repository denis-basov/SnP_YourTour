import IMask from 'imask';

document.addEventListener('DOMContentLoaded', function() {

    // только кириллица в имени
    const nameField = document.getElementById('name');
    if (nameField) {
        nameField.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-zА-Яа-яЁё\s\-'’]/g, '');
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

    // Функция, которая будет вызывать календарь
    function openCalendar(event) {
      const input = event.currentTarget;
      if (input.showPicker) {
        input.showPicker();   
      }
    }

    // Назначаем обработчики клика
    if (dateFrom) dateFrom.addEventListener('click', openCalendar);
    if (dateTo) dateTo.addEventListener('click', openCalendar);

    // активные табы в секции туров
    const toursNavItems = document.querySelectorAll('.tours .tours__nav .nav__item');

    toursNavItems.forEach((item) => {
        item.addEventListener('click', (event) => {
        event.preventDefault();
        toursNavItems.forEach((tab) => tab.classList.remove('active'));
        item.classList.add('active');
        });
    });


    /**
     * Валидация формы
     */
    (function() {
        // Элементы формы
        const form = document.querySelector('.build-tour__form');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const ageYes = document.getElementById('age_yes');
        const ageNo = document.getElementById('age_no');
        const agreementCheck = document.getElementById('agreement_checkbox');

        // Вспомогательные функции для ошибок
        function showError(element, message) {
            const formGroup = element.closest('.form-group');
            const oldError = formGroup.querySelector('.error-message');
            if (oldError) oldError.remove();
            formGroup.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }

        function removeError(element) {
            const formGroup = element.closest('.form-group');
            formGroup.classList.remove('error');
            const errorMsg = formGroup.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        }

        // Валидация email
        function isValidEmail(email) {
            const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
            return re.test(email);
        }

        // Валидация телефона через IMask
        // IMask уже наложен, но проверяем, что введены все 10 цифр
        function isValidPhone(phoneValue) {
            const digits = phoneValue.replace(/\D/g, '');
            // Должно быть 11 цифр (первая 7) – потому что маска +7 (000) 000-00-00
            return digits.length === 11 && digits[0] === '7';
        }

        // Главная проверка формы
        function validateForm(event) {
            event.preventDefault();
            let isValid = true;

            // 1. Email
            const email = emailInput.value.trim();
            if (!email) {
                showError(emailInput, 'Пожалуйста, введите email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(emailInput, 'Введите корректный email (например, name@domain.com)');
                isValid = false;
            } else {
                removeError(emailInput);
            }

            // 2. Телефон (маска уже применена)
            const phone = phoneInput.value;
            if (!phone || phone === '+7 (   )   -  -') { // стандартная пустая маска
                showError(phoneInput, 'Пожалуйста, введите номер телефона');
                isValid = false;
            } else if (!isValidPhone(phone)) {
                showError(phoneInput, 'Номер должен быть в формате +7 (XXX) XXX-XX-XX и содержать 10 цифр');
                isValid = false;
            } else {
                removeError(phoneInput);
            }

            // 3. Согласие с договором
            if (!agreementCheck.checked) {
                showError(agreementCheck, 'Вы должны принять условия Лицензионного договора');
                isValid = false;
            } else {
                removeError(agreementCheck);
            }

            // 4. Возраст (если выбран "Нет")
            if (ageNo.checked) {
                const ageGroup = ageNo.closest('.age-group');
                showError(ageGroup, 'Для покупки тура необходимо быть старше 18 лет.');
                isValid = false;
            } else {
                const ageGroup = ageNo.closest('.age-group');
                removeError(ageGroup);
            }

            if (isValid) {
                // Здесь можно отправить форму
                // form.submit();
                alert('Форма успешно отправлена!'); // демонстрация
            }
        }

        // Навешиваем обработчик на кнопку "Найти тур"
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.addEventListener('click', validateForm);

        // Снимаем ошибки при исправлении полей
        emailInput.addEventListener('input', () => removeError(emailInput));
        phoneInput.addEventListener('input', () => removeError(phoneInput));
        agreementCheck.addEventListener('change', () => removeError(agreementCheck));
        ageYes.addEventListener('change', () => {
            if (ageYes.checked) removeError(ageYes.closest('.age-group'));
        });
        ageNo.addEventListener('change', () => {
            if (ageNo.checked) {
                // Не показываем ошибку сразу, только при попытке отправки
                removeError(ageNo.closest('.age-group'));
            }
        });

    })();


    /**
     * Фиксированное меню после 450px
     */
    (function() {
        const wrapper = document.querySelector('.header__top-fixed');
        const header = document.querySelector('.header');
        if (!wrapper || !header) return;

        const scrollThreshold = 450;

        function checkScroll() {
            if (window.scrollY > scrollThreshold) {
            if (!wrapper.classList.contains('header__top-fixed--scrolled')) {
                // Запоминаем высоту внутреннего блока, чтобы компенсировать скачок
                const innerHeight = document.querySelector('.header__top').offsetHeight;
                header.style.paddingTop = innerHeight + 'px';
                wrapper.classList.add('header__top-fixed--scrolled');
            }
            } else {
            if (wrapper.classList.contains('header__top-fixed--scrolled')) {
                wrapper.classList.remove('header__top-fixed--scrolled');
                header.style.paddingTop = '';
            }
            }
        }

        window.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        checkScroll();
    })();


});








