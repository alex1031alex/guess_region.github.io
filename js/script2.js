'use strict';

// Определим цвета в которые будут закрашиваться районы в игре
const GREEN = '#00b358';
const YELLOW = '#ffff73';
const ORANGE = '#ff9200';
const CRIMSON = '#dc143c';
const RED = '#f60018';

// Установим время задержки показа всплывающих окон
const POPUP_DELAY_TIME = 400;

// Формируем списки районов и функцию для работы с ними
const regions = {
	"totalList": document.querySelectorAll('.map path'),
	"playingList": null,
	"renewPlayingList": function () {
		this.playingList = document.querySelectorAll('[data-playing="true"]');
	}
};

// Создаём ассоциативный массив из названий районов на русском языке
const idToTitle = {
 'velizh': 'Велижский район', 
 'demidov': 'Демидовский район', 
 'rudnya': 'Руднянский район', 
 'krasniy': 'Краснинский район',
 'smolensk': 'Смоленский район', 
 'monastyrshchina': 'Монастырщинский район',
 'duhovshchina': 'Духовщинский район', 
 'kardymovo': 'Кардымовский район',
 'dorogobuzh': 'Дорогобужский район',
 'yartsevo': 'Ярцевский район', 
 'safonovo': 'Сафоновский район',
 'holm-zhirki': 'Холм-Жирковский район',
 'pochinok': 'Починковский район',
 'roslavl': 'Рославльский район',
 'novodugino': 'Новодугинский район',
 'gagarin': 'Гагаринский район',
 'sychevka': 'Сычёвский район',
 'vyazma': 'Вяземский район',
 'temkino': 'Тёмкинский район',
 'ugra': 'Угранский район',
 'glinka': 'Глинковский район',
 'elnya': 'Ельнинский район',
 'hislavichi': 'Хиславичский район',
 'shumyachi': 'Шумячский район',
 'ershichi': 'Ершичский район'
};

// Находим элементы интерфейса для запуска игры
const descPopup = document.querySelector('.description');
const startButton = descPopup.querySelector('.description .popup__btn');
const restartButton = document.querySelector('.popup__btn--restart');
const questionField = document.querySelector('.info__item--quest');
const userResultField = document.querySelector('.current-result__value');
const finalResultPopup = document.querySelector('.final-result');
const infoSection = document.querySelector('.info');

//Создаём функцию запуска игры
const startGame = function () {
	// Устанавливаем каждому району свойство counter,меняем указатель, вешаем обработчики
	regions.totalList.forEach(function(reg){
		reg.counter = 3;
		reg.setAttribute('data-playing', true);
		// reg.dataset.playing = false;
		reg.style.cursor = 'pointer';
		reg.addEventListener('click', onRegionClick);
	});
	// Формируем список регионов, подлежащих отгадыванию
	regions.playingList = document.querySelectorAll('[data-playing="true"]');
	console.log(regions.playingList);
	// Скрываем описание
	descPopup.hidden = true;
	// Открываем информационный блок
	infoSection.hidden = false;
	// Задаём первый вопрос
	askQuestion();
};

// Вешаем обработчик на кнопку запуска
startButton.addEventListener('click', startGame);

// Создаём загаданный район и район указанный игроком
let guessedRegion;
let guessedRegionTitle;
let userRegionTitle;
let userResult = 0;

// Создаём функцию генерации случайных чисел
const getRandomInteger = function (min, max) {
	let rand = min + Math.random() * (max + 1 - min);
	 return Math.floor(rand);
};

// Создаём функцию генерации вопросов
const askQuestion = function () {
	let randomNum = getRandomInteger(0, regions.playingList.length - 1);
	guessedRegion = regions.playingList[randomNum];
	guessedRegionTitle = idToTitle[guessedRegion.id];
	questionField.textContent = `Где находится ${guessedRegionTitle}?`;
	console.log(`Длина массива районов в игре: ${regions.playingList.length}`);
	console.log(`Случайное число: ${randomNum}`);
	console.log(regions.playingList);
	console.log(`Загадан район: ${guessedRegion.id}`);
	console.log(guessedRegion);
};

// Создаём функцию закрашивания района
const paintRegion = function (region, color) {
	region.style.fill = color;
};

// Создаём функцию обработчик клика
const onRegionClick = function (evt) {
	console.log(this);
		userRegionTitle = idToTitle[this.id];
		if (guessedRegionTitle === userRegionTitle) { 
			if (guessedRegion.counter === 3) {
				paintRegion(this, GREEN);
				userResult += 4;
			} else if (guessedRegion.counter === 2) {
				paintRegion(this, YELLOW);
				userResult += 3;
			} else if (guessedRegion.counter === 1) {
				paintRegion(this, ORANGE);
				userResult += 1;
			}
			showTip(evt.pageX, evt.pageY, true);
			userResultField.textContent = userResult;
			this.style.cursor = '';
			this.removeEventListener('click', onRegionClick);
			this.dataset.playing = false;
			regions.renewPlayingList();
			if (regions.playingList.length > 0) {
				askQuestion();
			} else {
				setTimeout(finishGame, POPUP_DELAY_TIME);
			}
		} else {
			guessedRegion.counter--;
			showTip(evt.pageX, evt.pageY, false);
			if (guessedRegion.counter === 0) {
				paintRegion(guessedRegion, CRIMSON);
				guessedRegion.classList.add('blinking');
				guessedRegion.removeEventListener('click', onRegionClick);
				guessedRegion.addEventListener('click', onFailedRegionClick);
			}
		}
};

// Создаём обработчик клика на регионе, который не был угадан
const onFailedRegionClick = function () {
	paintRegion(this, RED);
	this.classList.remove('blinking');
	this.dataset.playing = false;
	regions.renewPlayingList();
	this.style.cursor = '';
	this.removeEventListener('click', onFailedRegionClick);
	if (regions.playingList.length > 0) {
		askQuestion();
	} else {
		finishGame();
	}
}

// Создаём функцию завершения игры
const finishGame = function () {
	console.log(guessedRegion);
	finalResultPopup.hidden = false;
	questionField.hidden = true;
	document.querySelector('.final-result .popup__title').textContent += ` ${userResult}%`;
	let resume = document.querySelector('.final-result .popup__text');
	if (userResult === 100) {
		resume.textContent = 'Блестящий результат! Вы превосходно знаете Смоленскую область!';
	} else if (userResult >= 90) {
		resume.textContent = 'Отличный результат! Вы хорошо знаете Смоленскую область';
	} else if (userResult >= 80) {
		resume.textContent = 'Вполне достойный результат. Вы неплохо знаете Смоленскую область';
	} else if (userResult >=70) {
		resume.textContent = 'Средний результат. В целом Вы знаете Смоленскую область, но иногда допускаете ошибки. Есть куда стремиться.';
	} else if (userResult >= 50) {
		resume.textContent = 'Слабенько. Вы плохо знаете Смоленскую область.';
	} else {
		resume.textContent = 'Очень плохо! Вы не знаете Смоленскую область.';
	}
};

// Вешаем обработчик на кнопку перезагрузки
restartButton.addEventListener('click', function () {
	location.reload();
});
