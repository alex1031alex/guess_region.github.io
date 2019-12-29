'use strict'
// Создадим всплывающие окна-подсказки

// Сообщения в подсказках
const SUCCES_MESSAGE = 'Вы угадали!';
const MISTAKE_MESSAGE = 'Нет, это не он!';

// Время показа подсказок
const TIP_SHOW_TIME = 600;

// Страница и шаблон с подсказками
const page = document.querySelector('body');
const tipTemplate = document.querySelector('#tip').content.querySelector('.tip');

// Создадим функцию показывающую подсказки
const showTip = function (coordX, coordY, isRight) {
	const tip = tipTemplate.cloneNode(true);
	const tipText = tip.querySelector('.tip__text');

	if (isRight) {
		tipText.textContent = SUCCES_MESSAGE;
	} else {
		tipText.textContent = MISTAKE_MESSAGE;
	}

	tip.style.left = `${coordX}px`;
	tip.style.top = `${coordY}px`;
	page.appendChild(tip);

	const tipRemove = function () {
		tip.remove();
	}

	setTimeout(tipRemove, TIP_SHOW_TIME);
}
