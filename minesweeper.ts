const fieldSize = 100;
const minesCount: number = 10;
const fieldWidth = Math.sqrt(fieldSize);
const arrField: number[] = new Array(fieldSize).fill(0);
//console.log(fieldWidth);
//const neighborIndexes: number[] = [-(fieldWidth-1), -fieldWidth, -(fieldWidth+1), -1, 1,
//    fieldWidth, fieldWidth-1, fieldWidth+1];
const buttonsContainer = document.querySelector('.buttons');

for (let i: number = 0; i < minesCount; i++) {
    if (arrField[i] !== 9) {
        arrField[i] = 9;
    }
}
for (let i = arrField.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrField[i], arrField[j]] = [arrField[j], arrField[i]];
}

buttonsContainer?.setAttribute('style', `grid-template-columns: repeat(${fieldWidth}, 1fr);`);
arrField.forEach((_, index) => {
    const button = document.createElement('button');
    //button.textContent = value.toString();
    //button.setAttribute('data-value', value.toString());
    button.setAttribute('index', index.toString());
    buttonsContainer?.appendChild(button);

    button.addEventListener('click', function() {
        if (this.textContent !== '⛳️'){
            if (arrField[Number(this.getAttribute('index'))] === 9) {
                this.textContent = '💣';
                this.setAttribute('data-value', '💣');
            } else {
                let mines: number = 0;
                let currentIndex = Number(this.getAttribute('index'));
                let neighborI: number[] = [];
                switch (true){
                    case (currentIndex === 0): //левый верхний угол
                        neighborI = [1, fieldWidth, fieldWidth+1];
                        break;
                    case (currentIndex === fieldWidth-1): //правый верхний угол
                        neighborI = [-1, fieldWidth, fieldWidth-1];
                        break;
                    case (currentIndex < fieldWidth): //верхняя строка
                        neighborI = [-1, 1, fieldWidth, fieldWidth-1, fieldWidth+1];
                        break;
                    case (currentIndex === fieldSize-fieldWidth): //левый нижний угол
                        neighborI = [1, -fieldWidth, -fieldWidth+1];
                        break;
                    case (currentIndex === fieldSize-1): //правый нижний угол
                        neighborI = [-1, -fieldWidth, fieldWidth-1];
                        break;
                    case (currentIndex > fieldSize - fieldWidth): //нижняя строка
                        neighborI = [-1, 1, -fieldWidth, -fieldWidth-1, -fieldWidth+1];
                        break;
                    case ((currentIndex) % fieldWidth === 0): //левый столбец
                        neighborI = [-fieldWidth, -fieldWidth+1, 1, fieldWidth, fieldWidth+1]
                        break;
                    case ((currentIndex + 1) % fieldWidth === 0): //правый столбец
                        neighborI = [-fieldWidth-1, -fieldWidth, -1, fieldWidth, fieldWidth-1];

                        break;
                    default:
                        neighborI = [-fieldWidth-1, -fieldWidth, -fieldWidth+1, -1, 1,
                            fieldWidth, fieldWidth-1, fieldWidth+1];
                        console.log(currentIndex);
                }
                neighborI.forEach(element => {
                    if (arrField[currentIndex + element] === 9){
                        mines++;
                    }
                    // else if ((arrField[currentIndex + element] === 0) && ((element === 1) || (element === -1) ||
                    //     (element === fieldWidth) || (element === -fieldWidth))) {
                    //         const buttonsElements = document.querySelectorAll(`.button[index="${currentIndex + element}"]`);
                    //         buttonsElements.forEach(element => {
                    //             element.setAttribute('data-value', '0');
                    //         });
                    // }
                });
                mines !== 0 ? this.textContent = mines.toString(): this.textContent = '';
                this.setAttribute('data-value', mines.toString());
            }
        }
    });
    button.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        this.textContent === '⛳️' ? this.textContent =
            this.getAttribute('data-value'.toString()) : this.textContent = '⛳️';
    });
});
