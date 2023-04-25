const cellSpan = `<span oncontextmenu="return false" class="block"></span>`;
const MusicInBackground = new Audio('../css/music/index.mp3');

var setting = JSON.parse(localStorage.getItem('settings'));
var fieldClass = document.querySelector('.field-area');



var list = document.querySelector('.setting-game-list');
list.value = setting.area; 
var valueMiens = document.querySelector('.settings-game__input');
valueMiens.setAttribute('max', `${Math.round(Number(list.value) * Number(list.value) / 2)}`)
document.querySelector('.settings-game__text > span').textContent = setting.valueBomb;
valueMiens.value = setting.valueBomb;
var maxInput = document.getElementById('maxInput');
const button = document.querySelector('.settings-game__button');

let cells = [];
let idSpan = 20;

function FieldArea() {
   fieldClass.textContent = ' '
   fieldClass.style.gridTemplateRows = `repeat(${list.value}, 1fr)`;
   fieldClass.style.gridTemplateColumns = `repeat(${list.value}, 1fr)`;
   for (let i = 0; i < list.value*list.value; i++){
      fieldClass.innerHTML = cellSpan + fieldClass.innerHTML;
   }
   idSpan = 20;
   cells = document.querySelectorAll('.block');
   cells.forEach((elem) => {
      elem.id = idSpan;
      idSpan++;
   })
   
   valueMiens.setAttribute('max', `${Math.round(Number(list.value) * Number(list.value) / 2)}`)
   
   document.querySelector('.settings-game__text > span').textContent = valueMiens.value;
}
FieldArea();



function generateArrayRandomNumber (min, max) {
	var totalNumbers 		= max - min + 1,
		arrayTotalNumbers 	= [],
		arrayRandomNumbers 	= [],
		tempRandomNumber;

	while (totalNumbers--) {
		arrayTotalNumbers.push(totalNumbers + min);
	}

	while (arrayTotalNumbers.length) {
		tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
		arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
		arrayTotalNumbers.splice(tempRandomNumber, 1);
	}
	return arrayRandomNumbers;
}
function addBombs() {
   cells.forEach((elem) => {
      elem.classList.remove('bomb');
   })
   bombs = generateArrayRandomNumber(20, 120);
   for (let i = 0; i < valueMiens.value; i++) {
      cells.forEach((elem) => {
         if (elem.id == bombs[i]) {
            elem.classList.add('bomb');
         }
      })
   };
}
addBombs();

maxInput.textContent = Math.round(Number(list.value) * Number(list.value) / 2)

list.addEventListener('change', () => {
   maxInput.textContent = Math.round(Number(list.value) * Number(list.value) / 2)
   FieldArea();
   addBombs();
})
valueMiens.addEventListener('input', () => {
   maxInput.textContent = Math.round(Number(list.value) * Number(list.value) / 2);
   document.querySelector('.settings-game__text > span').textContent = valueMiens.value;
   addBombs();
})
button.addEventListener('click', () => {
   localStorage.setItem('settings', JSON.stringify({
      valueBomb: valueMiens.value,
      area: list.value,
      
   }));
})

if (setting.valueMusic >= 199) {
   setting.valueMusic = 0;
}
MusicInBackground.currentTime = setting.valueMusic;
MusicInBackground.play();

function ExitSite() {
      localStorage.setItem('settings', JSON.stringify({
            valueBomb: setting.valueBomb,
            area: setting.area,
            valueMusic: MusicInBackground.currentTime
      }))
}