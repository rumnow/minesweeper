var _a;
var fieldSize = 100;
var minesCount = 10;
var fieldWidth = Math.sqrt(fieldSize);
var arrField = new Array(fieldSize).fill(0);
//console.log(fieldWidth);
//const neighborIndexes: number[] = [-(fieldWidth-1), -fieldWidth, -(fieldWidth+1), -1, 1,
//    fieldWidth, fieldWidth-1, fieldWidth+1];
var buttonsContainer = document.querySelector('.buttons');
for (var i = 0; i < minesCount; i++) {
    if (arrField[i] !== 9) {
        arrField[i] = 9;
    }
}
for (var i = arrField.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    _a = [arrField[j], arrField[i]], arrField[i] = _a[0], arrField[j] = _a[1];
}
buttonsContainer === null || buttonsContainer === void 0 ? void 0 : buttonsContainer.setAttribute('style', "grid-template-columns: repeat(" + fieldWidth + ", 1fr);");
arrField.forEach(function (_, index) {
    var button = document.createElement('button');
    //button.textContent = value.toString();
    //button.setAttribute('data-value', value.toString());
    button.setAttribute('index', index.toString());
    buttonsContainer === null || buttonsContainer === void 0 ? void 0 : buttonsContainer.appendChild(button);
    button.addEventListener('click', function () {
        if (this.textContent !== '⛳️') {
            if (arrField[Number(this.getAttribute('index'))] === 9) {
                this.textContent = '💣';
                this.setAttribute('data-value', '💣');
            }
            else {
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
                    default:
                        neighborI = [-fieldWidth - 1, -fieldWidth, -fieldWidth + 1, -1, 1,
                            fieldWidth, fieldWidth - 1, fieldWidth + 1];
                        console.log(currentIndex_1);
                }
                neighborI.forEach(function (element) {
                    if (arrField[currentIndex_1 + element] === 9) {
                        mines_1++;
                    }
                    // else if ((arrField[currentIndex + element] === 0) && ((element === 1) || (element === -1) ||
                    //     (element === fieldWidth) || (element === -fieldWidth))) {
                    //         const buttonsElements = document.querySelectorAll(`.button[index="${currentIndex + element}"]`);
                    //         buttonsElements.forEach(element => {
                    //             element.setAttribute('data-value', '0');
                    //         });
                    // }
                });
                mines_1 !== 0 ? this.textContent = mines_1.toString() : this.textContent = '';
                this.setAttribute('data-value', mines_1.toString());
            }
        }
    });
    button.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        this.textContent === '⛳️' ? this.textContent =
            this.getAttribute('data-value'.toString()) : this.textContent = '⛳️';
    });
});
