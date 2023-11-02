var fieldSize = 100; //всего клеток
var minesCount = 10; //всего мин
var fieldWidth = Math.sqrt(fieldSize); //ширина поля
var arrField = new Array(fieldSize).fill(0); //клетки с минами
var arrChecked = new Array(fieldSize).fill(false); //клетки куда уже тыкали
var minesLeft = minesCount;
var buttonsContainer = document.querySelector('.buttons');
var playerNameInput = document.getElementById('playerName');
var timeElapsedInput = document.getElementById('timeElapsed');
var minesLeftInput = document.getElementById('minesLeft');
minesLeftInput.value = minesCount.toString();
//расставляем мины
var i = 0;
var setRandomNine = function () {
    var r = Math.floor(Math.random() * fieldSize);
    if (arrField[r] !== 9) {
        arrField[r] = 9;
        i++;
    }
    else {
        setRandomNine();
    }
};
while (i < minesCount) {
    setRandomNine();
}
//считаем соседей
// for (let [index, value] of arrField.entries()){
//     if (value !== 9 ){
//         arrField[index] = checkMinesCount(index);
//     }
// }
//console.log(arrField);
//создаем кнопки
buttonsContainer === null || buttonsContainer === void 0 ? void 0 : buttonsContainer.setAttribute('style', "grid-template-columns: repeat(" + fieldWidth + ", 1fr);");
arrField.forEach(function (value, index) {
    if (value !== 9) {
        arrField[index] = checkMinesCount(index);
        //console.log(arrField[index]);
    }
    var button = document.createElement('button');
    button === null || button === void 0 ? void 0 : button.setAttribute('index', index.toString());
    buttonsContainer === null || buttonsContainer === void 0 ? void 0 : buttonsContainer.appendChild(button);
    button.addEventListener('click', function () {
        arrChecked[index] = true;
        if (this.textContent !== '⛳️') { //проверяем на флажок
            if (arrField[Number(this.getAttribute('index'))] === 9) {
                //const allBombs = document.querySelectorAll(`button[index="${index}"]`);
                for (var indBomb in arrField) {
                    if (arrField[indBomb] === 9) {
                        var cell = document.querySelector("button[index=\"" + indBomb + "\"]");
                        cell.textContent = '💣'; //если наступили на бомбу
                        cell === null || cell === void 0 ? void 0 : cell.setAttribute('data-value', '💣');
                    }
                }
            }
            else { // выбираем соседей
                var currentIndex = Number(this.getAttribute('index'));
                var mines = checkMinesCount(currentIndex);
                if (mines !== 0) {
                    this.textContent = mines.toString();
                    arrField[currentIndex] = mines;
                }
                else {
                    this.textContent = '';
                    checkEmptyCell(currentIndex);
                    //this.setAttribute('checked', '0');
                }
                this.setAttribute('checked', '1');
            }
        }
        win();
    });
    button.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        if (this.textContent === '⛳️') {
            if (this.getAttribute('checked') === '1' && arrField[index] > 0) {
                this.textContent = arrField[index].toString();
            }
            else {
                this.textContent = '';
            }
            minesLeft++;
        }
        else if (minesLeft > 0) {
            this.textContent = '⛳️';
            minesLeft--;
        }
        minesLeftInput.value = minesLeft.toString();
        win();
    });
});
//win?
function win() {
    if (fieldSize === minesCount + arrChecked.filter(function (value) { return value === true; }).length) {
        alert('You win!');
    }
}
//считаем соседние мины рядом
function checkMinesCount(index) {
    var mines = 0;
    var neighborI = [];
    switch (true) {
        case (index === 0): //левый верхний угол
            neighborI = [1, fieldWidth, fieldWidth + 1];
            break;
        case (index === fieldWidth - 1): //правый верхний угол
            neighborI = [-1, fieldWidth, fieldWidth - 1];
            break;
        case (index < fieldWidth): //верхняя строка
            neighborI = [-1, 1, fieldWidth, fieldWidth - 1, fieldWidth + 1];
            break;
        case (index === fieldSize - fieldWidth): //левый нижний угол
            neighborI = [1, -fieldWidth, -fieldWidth + 1];
            break;
        case (index === fieldSize - 1): //правый нижний угол
            neighborI = [-1, -fieldWidth, fieldWidth - 1];
            break;
        case (index > fieldSize - fieldWidth): //нижняя строка
            neighborI = [-1, 1, -fieldWidth, -fieldWidth - 1, -fieldWidth + 1];
            break;
        case ((index) % fieldWidth === 0): //левый столбец
            neighborI = [-fieldWidth, -fieldWidth + 1, 1, fieldWidth, fieldWidth + 1];
            break;
        case ((index + 1) % fieldWidth === 0): //правый столбец
            neighborI = [-fieldWidth - 1, -fieldWidth, -1, fieldWidth, fieldWidth - 1];
            break;
        default: //обычные клетки 8 соседей
            neighborI = [-fieldWidth - 1, -fieldWidth, -fieldWidth + 1, -1, 1,
                fieldWidth, fieldWidth - 1, fieldWidth + 1];
    }
    neighborI.forEach(function (element) {
        if (arrField[index + element] === 9) {
            mines++;
        }
    });
    return mines;
}
//считаем пустые поля
function checkEmptyCell(index) {
    var neighborI = [];
    switch (true) {
        case (index === 0): //левый верхний угол
            neighborI = [1, fieldWidth];
            break;
        case (index === fieldWidth - 1): //правый верхний угол
            neighborI = [-1, fieldWidth];
            break;
        case (index < fieldWidth): //верхняя строка
            neighborI = [-1, 1, fieldWidth];
            break;
        case (index === fieldSize - fieldWidth): //левый нижний угол
            neighborI = [1, -fieldWidth];
            break;
        case (index === fieldSize - 1): //правый нижний угол
            neighborI = [-1, -fieldWidth];
            break;
        case (index > fieldSize - fieldWidth): //нижняя строка
            neighborI = [-1, 1, -fieldWidth];
            break;
        case ((index) % fieldWidth === 0): //левый столбец
            neighborI = [-fieldWidth, 1, fieldWidth];
            break;
        case ((index + 1) % fieldWidth === 0): //правый столбец
            neighborI = [-fieldWidth, -1, fieldWidth];
            break;
        default: //обычные клетки 4 соседа
            neighborI = [-fieldWidth, -1, 1, fieldWidth];
        //console.log(currentIndex);
    }
    neighborI.forEach(function (element) {
        var cell = document.querySelector("button[index=\"" + (index + element) + "\"]");
        if (arrField[index + element] === 0 && !arrChecked[index + element]
            && checkMinesCount(index + element) === 0) {
            arrChecked[index + element] = true;
            cell === null || cell === void 0 ? void 0 : cell.setAttribute('checked', '1');
            checkEmptyCell(index + element);
        }
        else if (arrField[index + element] !== 0 && !arrChecked[index + element]) {
            arrChecked[index + element] = true;
            cell.textContent = arrField[index + element].toString(); //checkMinesCount(index + element).toString()
            cell === null || cell === void 0 ? void 0 : cell.setAttribute('checked', '1');
        }
    });
}
