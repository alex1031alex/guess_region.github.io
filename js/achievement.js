// Добавим ачивки - значки которые будут появляться при угадывании районов
const achivementTemplate = document.querySelector('#achievement')
		.content.querySelector('.achievement-item');
const containerLeft = document.querySelector('.achievement__left');
const containerRight = document.querySelector('.achievement__right');
let isOdd = false;

const showAchievement = function (regionName) {
	const block = achivementTemplate.cloneNode(true);
	block.style.backgroundImage = `url("img/${regionName}.png")`;
	block.classList.add('achievement-animation');
	if (isOdd) {
		containerLeft.appendChild(block);
		isOdd = false;
	} else {
		containerRight.appendChild(block);
		isOdd = true;
	}	
};