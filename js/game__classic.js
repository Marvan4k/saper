// Ячейка
const cellSpan = `<span oncontextmenu="return false" onmousedown="clickMouse(event.target, event)" data-flag="false"
                  data-clue="false" class="block"></span>`;

// Музыка
const winMusic = new Audio("../saper/css/music/winMusic.mp3");
const loseMusic = new Audio("../saper/css/music/loseMusic.mp3");
const trollMusic = new Audio("../saper/css/music/trollMusic.mp3");

// Получение данных из настроек
var setting = JSON.parse(localStorage.getItem("settings"));
var fieldClass = document.querySelector(".field-area");
fieldClass.style.gridTemplateRows = `repeat(${setting.area}, 1fr)`;
fieldClass.style.gridTemplateColumns = `repeat(${setting.area}, 1fr)`;
for (let i = 0; i < setting.area * setting.area; i++) {
  fieldClass.innerHTML = cellSpan + fieldClass.innerHTML;
}
let endTimer;
let seconds = 0;
let minutes = 0;
let hours = 0;
let cells = document.querySelectorAll(".block");
let field = setting.area;
let idSpan = 0;
let sum = 0;
let bombs = [];
let colors = [
  0,
  "#75c5c6",
  "#1ec2c1",
  "#00b6b3",
  "#00afaa",
  "#008f8d",
  "#007e7d",
  "#006c66",
  "#005c5a",
];
var eventClick;
let timerActive;
let kolBomb = setting.valueBomb;
let remainingBobmbs = kolBomb;
let valueCell = field * field - kolBomb;
let flags = kolBomb;
let checkAirCellMassive = [];
let cellHover;

let onTime = false;
let checkCenter = false;
let loseFirstClick = false;
let regenBombs = false;
let bombActive = false;
let firstclick = false;
let checkActive = false;
let checkBomb2 = false;
let clue = false;
let openingCell = true;

let coordsLeftUp = [9, 10, 19];
let coordsRightUp = [10, 11, 21];
let coordsLeftDown = [19, 29, 30];
let coordsRightDown = [21, 30, 31];
let coordsTop = [9, 10, 11, 19, 21];
let coordsBottom = [19, 21, 29, 30, 31];
let coordsLeft = [9, 10, 19, 29, 30];
let coordsRight = [10, 11, 21, 30, 31];
let coordsCenter = [11, 10, 9, 1, -1, 9, -10, -11];

let idCornerCells = [];
let idNotInCenter = [];
let idRightCell = [];
let idLeftCell = [];

let valueBomb;

document.querySelector(".standart").addEventListener("click", () => {
  document.querySelector(".modeSelectin").style.display = "none";
  endTimer = 86400;
});
document.querySelector(".onTime").addEventListener("click", () => {
  document.querySelector(".modeSelectin").style.display = "none";
  onTime = true;
  endTimer = 300;
});

function addIdInSystem() {
  // Добавление id к span элементам
  cells.forEach((elem) => {
    elem.id = idSpan;
    elem.classList.add("hide");
    idSpan++;
  });
  idSpan = 0;
  idCornerCells.push(idSpan);
  idCornerCells.push(idSpan + (setting.area - 1));
  idCornerCells.push(idSpan + setting.area * setting.area - setting.area);
  idCornerCells.push(idSpan + setting.area * setting.area - 1);
  for (let i = 1; i < setting.area - 1; i++) {
    idLeftCell.push(idSpan + setting.area * i);
    idRightCell.push(idSpan + setting.area * (1 + i) - 1);
  }
}

addIdInSystem();

// Проверка соседних клеток
function checkCell(cell) {
  let valueArea = Number(setting.area);
  let cellId = Number(cell.id);
  checkCenter = false;
  // Левый верзний угол
  if (cellId == idSpan) {
    [idSpan + 1, idSpan + valueArea + 1, idSpan + valueArea].forEach((id) => {
      if (cells[id].classList.value == "block hide bomb") {
        valueBomb++;
      }
    });
      checkCenter = true;
  }
  // Правый верхний угол
  if (cellId == idSpan + setting.area - 1) {
    [idSpan + valueArea - 2, idSpan + valueArea + valueArea - 1, idSpan + valueArea + valueArea - 2].forEach((id) => {
        if (cells[id].classList.value == "block hide bomb") {
          valueBomb++;
        }
      });
      checkCenter = true;
  }
  // Левый нижний угол
  if (cellId == idSpan + setting.area * setting.area - setting.area) {
    [idSpan + valueArea * valueArea - valueArea - valueArea, idSpan + valueArea * valueArea - valueArea + 1, idSpan + valueArea * valueArea - valueArea - valueArea + 1].forEach((id) => {
      if (cells[id].classList.value == "block hide bomb") {
        valueBomb++;
      }
    });
      checkCenter = true;
  }
  // Правый нижний угол
  if (cellId == idSpan + setting.area * setting.area - 1) {
    [idSpan + valueArea * valueArea - 2, idSpan + valueArea * valueArea - valueArea - 1, idSpan + valueArea * valueArea - valueArea - 2].forEach((id) => {
      if (cells[id].classList.value == "block hide bomb") {
        valueBomb++;
      }
    });
      checkCenter = true;
  }

  // Верхний ряд
  if (cellId > idSpan && cellId < idSpan + valueArea) {
    [cellId - 1, cellId + 1, cellId + valueArea, cellId + valueArea - 1, cellId + valueArea + 1].forEach((id) => {
      if (cells[id].classList.value == "block hide bomb") {
        valueBomb++;
      }
    })
      checkCenter = true;
  }

  // Нижний ряд
  if (cellId < idSpan + valueArea * valueArea - 1 && cellId > idSpan + valueArea * valueArea - 1 - valueArea) {
    [cellId - 1, cellId + 1, cellId - valueArea, cellId - valueArea - 1, cellId - valueArea + 1].forEach((id) => {
      if (cells[id].classList.value == "block hide bomb") {
        valueBomb++;
      }
    })
      checkCenter = true;
  }

  // Правый ряд
  idRightCell.forEach((item) => {
    if (cellId == item) {
      [cellId - 1, cellId + valueArea, cellId + valueArea - 1, cellId - valueArea, cellId - valueArea - 1].forEach((id) => {
        if (cells[id].classList.value == "block hide bomb") {
          valueBomb++;
        }
      })
      checkCenter = true;
    }
  })

  // Левый ряд
  idLeftCell.forEach((item) => {
    if (cellId == item) {
      [cellId + 1, cellId - valueArea, cellId - valueArea + 1, cellId + valueArea, cellId + valueArea + 1].forEach((id) => {
        if (cells[id].classList.value == "block hide bomb") {
          valueBomb++;
        }
      })
      checkCenter = true;
    }
  })

  // Центр
  if (checkCenter == false) {
      [cellId + 1, cellId - 1, cellId + valueArea, cellId - valueArea, cellId + valueArea - 1, cellId - valueArea - 1, cellId + valueArea + 1, cellId - valueArea + 1].forEach((id) => {
        if (cells[id].classList.value == "block hide bomb") {
          valueBomb++;
        }
      })
  }
}
// Добавление цифр на бомбу
function checkBomb(cell) {
  valueBomb = 0;
  checkActive = false;
  if (cell.classList.value == "field-area") return 0;

  checkCell(cell);
  // Вывод значения
  if (cells[Number(cell.id)].classList.value == "block hide bomb") {
    cell.textContent = " ";
  } else {
    if (valueBomb == 0) {
      cell.textContent = " ";
    } else {
      cell.textContent = valueBomb;
      cell.style.color = `${colors[valueBomb]}`;
    }
  }
}
// Обновление бомб (Функция)
function updateBombs() {
  bombs = generateArrayRandomNumber(0, setting.area * setting.area);
  for (let i = 0; i < kolBomb; i++) {
    cells.forEach((elem) => {
      if (elem.id == bombs[i]) {
        elem.classList.add("bomb");
      }
    });
  }
  document.querySelector(".information-value-miens > span").textContent =
    kolBomb;
}

// Рандомные числа до определенного значения
function generateArrayRandomNumber(min, max) {
  var totalNumbers = max - min + 1,
    arrayTotalNumbers = [],
    arrayRandomNumbers = [],
    tempRandomNumber;

  while (totalNumbers--) {
    arrayTotalNumbers.push(totalNumbers + min);
  }

  while (arrayTotalNumbers.length) {
    tempRandomNumber = Math.round(
      Math.random() * (arrayTotalNumbers.length - 1)
    );
    arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
    arrayTotalNumbers.splice(tempRandomNumber, 1);
  }
  return arrayRandomNumbers;
}

// Обнуление бомб (Функция)
function clearBomb() {
  cells.forEach((elem) => {
    elem.classList.remove("bomb");
    elem.classList.remove("bombActive");
    elem.textContent = " ";
  });
}

// Таймер
// Запуск
function timer() {
  let valueTimer = 1;
  timerActive = setInterval(() => {
    if (valueTimer <= endTimer) {
      if (seconds < 60) {
        if (seconds < 10) {
          document.querySelector(".seconds>div>span").textContent =
            "0" + seconds;
        } else {
          document.querySelector(".seconds>div>span").textContent = seconds;
        }
        seconds++;
        valueTimer++;
      } else {
        seconds = 1;
        minutes++;
        if (minutes < 60) {
          if (minutes < 10) {
            document.querySelector(".minutes>div>span").textContent =
              "0" + minutes;
          } else {
            document.querySelector(".minutes>div>span").textContent = minutes;
          }
        } else {
          seconds = 1;
          minutes = 0;
          hours++;
          if (hours < 24) {
            if (hours < 10) {
              document.querySelector(".minutes>div>span").textContent =
                "0" + minutes;
              document.querySelector(".hours>div>span").textContent =
                "0" + hours;
            } else {
              document.querySelector(".minutes>div>span").textContent =
                "0" + minutes;
              document.querySelector(".hours>div>span").textContent = hours;
            }
          }
        }
      }
    } else {
      if (onTime == true) {
        gameover();
        document.querySelector(".field-lose > p").textContent =
          "Time is over...";
        clearInterval(timerActive);
      }
    }
  }, 1000);
}
// Остановка
function PauseTimer() {
  clearInterval(timerActive);
  document.querySelector(".seconds>div>span").textContent = "00";
  document.querySelector(".minutes>div>span").textContent = "00";
  document.querySelector(".hours>div>span").textContent = "00";
  seconds = 1;
  minutes = 0;
  hours = 0;
}

function restar() {
  cells.forEach((elem) => {
    elem.classList.add("hide");
    elem.dataset["flag"] = "false";
    elem.dataset["clue"] = "false";
  });
  flags = setting.valueBomb;
  kolBomb = setting.valueBomb;
  valueCell = field * field - kolBomb;
  remainingBobmbs = kolBomb;
  clearBomb();
  PauseTimer();
  updateBombs();
  document.querySelector(".information-value-miens > span").textContent =
    kolBomb;
  document.querySelector(".field-area").style.border =
    "5px solid rgb(54, 140, 151)";
  document.querySelector(".field-lose").style.display = "none";
  bombActive = false;
  firstclick = false;
  regenBombs = true;
  clue = false;
  loseFirstClick = false;
  winMusic.pause();
  loseMusic.pause();
  trollMusic.pause();
  winMusic.currentTime = 0;
  loseMusic.currentTime = 0;
  trollMusic.currentTime = 0;
}
// Пересоздание бомб
document.querySelector(".information__button").addEventListener("click", () => {
  restar();
});
document.querySelector(".field-lose>button").addEventListener("click", () => {
  //restar();
  document.querySelector(".field-lose").style.display = "none";
});

// Подсказка
function checkClue(number) {
  if (cells[bombs[number] - 20].dataset["flag"] != "true") {
    cells[bombs[number] - 20].dataset["clue"] = true;
  } else {
    temp = Math.floor(Math.random() * 20);
    checkClue(temp);
  }
}

document.querySelector(".information__lamp").addEventListener("click", () => {
  if (clue != false) return;
  let temp = Math.floor(Math.random() * kolBomb);
  checkClue(temp);
  clue = true;
  if (firstclick == false) {
    firstclick = true;
    timer();
  } else {
    firstclick = true;
  }
});

// Победа
function win() {
  winMusic.play();
  clearInterval(timerActive);
  document.querySelector(".field-lose").style.display = "flex";
  document.querySelector(".field-area").style.border =
    "5px solid rgb(14, 184, 57)";
  document.querySelector(".field-lose").style.background = "rgb(14, 184, 57)";
  document.querySelector(".field-lose > button").style.color =
    "rgb(14, 184, 57)";
  document.querySelector(".field-lose > p").textContent = "You win";
  bombActive = true;
}
// Проигрыш
function gameover() {
  if (loseFirstClick == false) {
    loseMusic.play();
    document.querySelector(".field-lose > p").textContent = "Game over";
  } else {
    trollMusic.play();
    document.querySelector(".field-lose > p").textContent = "Ops.. Bomb..";
  }
  document.querySelectorAll(".block.hide.bomb").forEach((item) => {
    item.classList.add("bombActive");
  });
  bombActive = true;
  document.querySelector(".field-lose").style.display = "flex";
  document.querySelector(".field-lose").style.background = "rgb(192, 53, 53)";
  document.querySelector(".field-lose > button").style.color =
    "rgb(192, 53, 53)";
  document.querySelector(".field-area").style.border =
    "5px solid rgb(192, 53, 53)";
  clearInterval(timerActive);
}

function leftClick(item) {
  if (item.dataset["flag"] == "false") {
    if (regenBombs == false) {
      updateBombs();
    }
    if (firstclick == false && item.classList.value != "field-area") {
      if (item.classList.value == "block hide bomb") {
        loseFirstClick = true;
      }
      firstclick = true;
      checkBomb(item);
      timer();
    } else if (firstclick == true && item.classList.value != "field-area") {
      checkBomb(item);
    }
    if (item.classList.value == "block hide" && firstclick != false) {
      valueCell--;
    }
    item.classList.remove("hide");
    // if (item.classList.value != "block bomb") {
    //   checkAirCell(item);
    // }
    if (item.classList == "block bomb") {
      item.classList.add("bombActive");
      gameover(item);
    }
    if (valueCell == 0 || remainingBobmbs == 0) {
      win();
    }
  }
}
function rightClick(item) {
  firstclick = true;
  if (
    item.dataset["flag"] == "false" &&
    flags > 0 &&
    item.classList.value != "block"
  ) {
    if (item.classList.value == "block hide bomb") {
      remainingBobmbs--;
    }
    item.dataset["flag"] = "true";
    flags--;
    kolBomb--;
    document.querySelector(".information-value-miens > span").textContent =
      kolBomb;
  } else if (
    item.dataset["flag"] == "true" &&
    flags >= 0 &&
    item.classList.value != "block"
  ) {
    if (item.classList.value == "block hide bomb") {
      remainingBobmbs++;
    }
    item.dataset["flag"] = "false";
    flags++;
    kolBomb++;
    document.querySelector(".information-value-miens > span").textContent =
      kolBomb;
  }
  if (valueCell == 0 || remainingBobmbs == 0) {
    win();
  }
}

// Открытие соседних ячеек
// function checkAirCell(item) {
//    checkAirCellMassive.push(item);
//    //while (openingCell == true) {
//       checkBomb(item);
//       if (item.textContent == ' ') {
//          openingCell = false;
//          if (cellHover == 1) {
//             checkAirCellMassive.length = 0;
//             coordsLeftUp.forEach((coord) => {
//                if (cells[Number(item.id) - coord].classList.value != 'block') {
//                   valueCell--;
//                }
//                cells[Number(item.id) - coord].classList.remove('hide');
//                checkBomb(cells[Number(item.id) - coord]);
//                if (cells[Number(item.id) - coord].textContent == ' ') {
//                   checkAirCellMassive.push(cells[Number(item.id) - coord]);
//                   openingCell = true;
//                }
//             })
//          } else if (cellHover == 2) {
//             checkAirCellMassive.length = 0;
//             coordsRightUp.forEach((coord) => {
//                if (cells[Number(item.id) - coord].classList.value != 'block') {
//                   valueCell--;
//                }
//                cells[Number(item.id) - coord].classList.remove('hide');
//                checkBomb(cells[Number(item.id) - coord]);
//                if (cells[Number(item.id) - coord].textContent == ' ') {
//                   checkAirCellMassive.push(cells[Number(item.id) - coord]);
//                   openingCell = true;
//                }
//             })
//          } else if (cellHover == 3) {
//             checkAirCellMassive.length = 0;
//             coordsLeftDown.forEach((coord) => {
//                if (cells[Number(item.id) - coord].classList.value != 'block') {
//                   valueCell--;
//                }
//                cells[Number(item.id) - coord].classList.remove('hide');
//                checkBomb(cells[Number(item.id) - coord]);
//                if (cells[Number(item.id) - coord].textContent == ' ') {
//                   checkAirCellMassive.push(cells[Number(item.id) - coord]);
//                   openingCell = true;
//                }
//             })
//          } else if (cellHover == 4) {
//             checkAirCellMassive.length = 0;
//             coordsRightDown.forEach((coord) => {
//                if (cells[Number(item.id) - coord].classList.value != 'block') {
//                   valueCell--;
//                }
//                cells[Number(item.id) - coord].classList.remove('hide');
//                checkBomb(cells[Number(item.id) - coord]);
//                if (cells[Number(item.id) - coord].textContent == ' ') {
//                   checkAirCellMassive.push(cells[Number(item.id) - coord]);
//                   openingCell = true;
//                }
//             })
//          } else if (cellHover == 5) {
//             checkAirCellMassive.length = 0;
//             coordsTop.forEach((coord) => {
//                if (cells[Number(item.id) - coord].classList.value != 'block') {
//                   valueCell--;
//                }
//                cells[Number(item.id) - coord].classList.remove('hide');
//                checkBomb(cells[Number(item.id) - coord]);
//                if (cells[Number(item.id) - coord].textContent == ' ') {
//                   checkAirCellMassive.push(cells[Number(item.id) - coord]);
//                   openingCell = true;
//                }
//             })
//          } else if (cellHover == 6) {
//             checkAirCellMassive.length = 0;
//             coordsBottom.forEach((coord) => {
//                if (cells[Number(item.id) - coord].classList.value != 'block') {
//                   valueCell--;
//                }
//                cells[Number(item.id) - coord].classList.remove('hide');
//                checkBomb(cells[Number(item.id) - coord]);
//                if (cells[Number(item.id) - coord].textContent == ' ') {
//                   checkAirCellMassive.push(cells[Number(item.id) - coord]);
//                   openingCell = true;
//                }
//             })
//          } else if (cellHover == 7) {
//             checkAirCellMassive.length = 0;
//             coordsLeft.forEach((coord) => {
//                if (cells[Number(item.id) - coord].classList.value != 'block') {
//                   valueCell--;
//                }
//                cells[Number(item.id) - coord].classList.remove('hide');
//                checkBomb(cells[Number(item.id) - coord]);
//                if (cells[Number(item.id) - coord].textContent == ' ') {
//                   checkAirCellMassive.push(cells[Number(item.id) - coord]);
//                   openingCell = true;
//                }
//             })
//          } else if (cellHover == 8) {
//             checkAirCellMassive.length = 0;
//             coordsRight.forEach((coord) => {
//                if (cells[Number(item.id) - coord].classList.value != 'block') {
//                   valueCell--;
//                }
//                cells[Number(item.id) - coord].classList.remove('hide');
//                checkBomb(cells[Number(item.id) - coord]);
//                if (cells[Number(item.id) - coord].textContent == ' ') {
//                   checkAirCellMassive.push(cells[Number(item.id) - coord]);
//                   openingCell = true;
//                }
//             })
//          } else if (cellHover == 9) {
//             checkAirCellMassive.length = 0;
//             coordsCenter.forEach((coord) => {
//                if (cells[Number(item.id) - coord].classList.value != 'block') {
//                   valueCell--;
//                }
//                cells[Number(item.id) - coord].classList.remove('hide');
//                checkBomb(cells[Number(item.id) - coord]);
//                if (cells[Number(item.id) - coord].textContent == ' ') {
//                   checkAirCellMassive.push(cells[Number(item.id) - coord]);
//                   openingCell = true;
//                }
//             })
//          }
//          if (openingCell == false) {

//          }
//       }
//    //}
// }

// Клики мышкой
function clickMouse(item, event) {
  // Левый клик
  if (event.button == 0 && bombActive == false) {
    leftClick(item);
  }
  // Правый клик
  if (event.button == 2 && bombActive == false && firstclick == true) {
    rightClick(item);
  }

  regenBombs = true; // Перестаем регенерировать бомбы
}

// Нажатие клавиш на клавиатуре
document.addEventListener("keydown", (elem) => {
  //console.log(elem.code)
  if (elem.code == "KeyR") {
    restar();
  }
  if (elem.code == "Escape") {
    window.location.href = "index.html";
  }
});
