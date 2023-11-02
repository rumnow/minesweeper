var fieldSize = 100;
var minesCount = 10;
var fieldWidth = Math.sqrt(fieldSize);
var arrField = new Array(fieldSize).fill(0);
var arrChecked = new Array(fieldSize).fill(false);
var buttonsContainer = document.querySelector('.buttons');
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
//создаем кнопки
buttonsContainer === null || buttonsContainer === void 0 ? void 0 : buttonsContainer.setAttribute('style', "grid-template-columns: repeat(" + fieldWidth + ", 1fr);");
arrField.forEach(function (_, index) {
    var button = document.createElement('button');
    //button.textContent = value.toString();
    //button.setAttribute('data-value', value.toString());
    button.setAttribute('index', index.toString());
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
                        cell.setAttribute('data-value', '💣');
                    }
                }
            }
            else { // выбираем соседей
                var mines_1 = 0;
                var currentIndex_1 = Number(this.getAttribute('index'));
                var neighborI = [];
                switch (true) {
                    case (currentIndex_1 === 0): //левый верхний угол
                        neighborI = [1, fieldWidth, fieldWidth + 1];
                        break;
                    case (currentIndex_1 === fieldWidth - 1): //правый верхний угол
                        neighborI = [-1, fieldWidth, fieldWidth - 1];
                        break;
                    case (currentIndex_1 < fieldWidth): //верхняя строка
                        neighborI = [-1, 1, fieldWidth, fieldWidth - 1, fieldWidth + 1];
                        break;
                    case (currentIndex_1 === fieldSize - fieldWidth): //левый нижний угол
                        neighborI = [1, -fieldWidth, -fieldWidth + 1];
                        break;
                    case (currentIndex_1 === fieldSize - 1): //правый нижний угол
                        neighborI = [-1, -fieldWidth, fieldWidth - 1];
                        break;
                    case (currentIndex_1 > fieldSize - fieldWidth): //нижняя строка
                        neighborI = [-1, 1, -fieldWidth, -fieldWidth - 1, -fieldWidth + 1];
                        break;
                    case ((currentIndex_1) % fieldWidth === 0): //левый столбец
                        neighborI = [-fieldWidth, -fieldWidth + 1, 1, fieldWidth, fieldWidth + 1];
                        break;
                    case ((currentIndex_1 + 1) % fieldWidth === 0): //правый столбец
                        neighborI = [-fieldWidth - 1, -fieldWidth, -1, fieldWidth, fieldWidth - 1];
                        break;
                    default: //обычные клетки 8 соседей
                        neighborI = [-fieldWidth - 1, -fieldWidth, -fieldWidth + 1, -1, 1,
                            fieldWidth, fieldWidth - 1, fieldWidth + 1];
                    //console.log(currentIndex);
                }
                neighborI.forEach(function (element) {
                    if (arrField[currentIndex_1 + element] === 9) {
                        mines_1++;
                    }
                });
                mines_1 !== 0 ? this.textContent = mines_1.toString() : this.textContent = '';
                this.setAttribute('data-value', mines_1.toString());
                //сюда нужно вставить обсчет пустых клеток рядом
                if (arrField[currentIndex_1] === 0) {
                    console.log(arrField[currentIndex_1]);
                    checkEmptyCell(currentIndex_1);
                }
            }
        }
    });
    button.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        this.textContent === '⛳️' ? this.textContent =
            this.getAttribute('data-value'.toString()) : this.textContent = '⛳️';
    });
});
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
    var cell = document.querySelector("button[index=\"" + index + "\"]");
    cell.setAttribute('data-value', "0");
    console.log(cell);
    neighborI.forEach(function (element) {
        if (arrField[index + element] === 0 && cell.getAttribute('data-value') !== "0") {
            checkEmptyCell(index + element);
        }
    });
}
