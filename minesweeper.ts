const fieldSize = 100;
const minesCount: number = 10;
const fieldWidth = Math.sqrt(fieldSize);
const arrField: number[] = new Array(fieldSize).fill(0);
const arrChecked: boolean[] = new Array(fieldSize).fill(false);

const buttonsContainer = document.querySelector('.buttons');

//расставляем мины
let i: number = 0;
let setRandomNine = () => {
    let r: number = Math.floor(Math.random() * fieldSize);
    if (arrField[r] !== 9) {
        arrField[r] = 9;
        i++;
    } else {
        setRandomNine();
    }
}
while (i < minesCount) {
    setRandomNine();
}

//создаем кнопки
buttonsContainer?.setAttribute('style', `grid-template-columns: repeat(${fieldWidth}, 1fr);`);
arrField.forEach((_, index) => {
    const button = document.createElement('button');
    //button.textContent = value.toString();
    //button.setAttribute('data-value', value.toString());
    button.setAttribute('index', index.toString());
    buttonsContainer?.appendChild(button);

    button.addEventListener('click', function() {
        arrChecked[index] = true;
        if (this.textContent !== '⛳️'){ //проверяем на флажок
            if (arrField[Number(this.getAttribute('index'))] === 9) {
                //const allBombs = document.querySelectorAll(`button[index="${index}"]`);
                for (let indBomb in arrField) {
                    if (arrField[indBomb] === 9) {
                        const cell = document.querySelector(`button[index="${indBomb}"]`) as HTMLButtonElement;
                        cell.textContent = '💣'; //если наступили на бомбу
                        cell.setAttribute('data-value', '💣');
                    }
                }
            } else {  // выбираем соседей
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
                    default: //обычные клетки 8 соседей
                        neighborI = [-fieldWidth-1, -fieldWidth, -fieldWidth+1, -1, 1,
                            fieldWidth, fieldWidth-1, fieldWidth+1];
                        //console.log(currentIndex);
                }
                neighborI.forEach(element => { //расчитываем количество мин вокруг
                    if (arrField[currentIndex + element] === 9){
                        mines++;
                    }
                });
                mines !== 0 ? this.textContent = mines.toString(): this.textContent = '';
                this.setAttribute('data-value', mines.toString());
                //сюда нужно вставить обсчет пустых клеток рядом
                if (arrField[currentIndex] === 0) {
                    console.log(arrField[currentIndex]);
                    checkEmptyCell(currentIndex);
                }
            }
        }
    });
    button.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        this.textContent === '⛳️' ? this.textContent =
            this.getAttribute('data-value'.toString()) : this.textContent = '⛳️';
    });
});

function checkEmptyCell(index: number): void {
    let neighborI: number[] = [];
    switch (true){
        case (index === 0): //левый верхний угол
            neighborI = [1, fieldWidth];
            break;
        case (index === fieldWidth-1): //правый верхний угол
            neighborI = [-1, fieldWidth];
            break;
        case (index < fieldWidth): //верхняя строка
            neighborI = [-1, 1, fieldWidth];
            break;
        case (index === fieldSize-fieldWidth): //левый нижний угол
            neighborI = [1, -fieldWidth];
            break;
        case (index === fieldSize-1): //правый нижний угол
            neighborI = [-1, -fieldWidth];
            break;
        case (index > fieldSize - fieldWidth): //нижняя строка
            neighborI = [-1, 1, -fieldWidth];
            break;
        case ((index) % fieldWidth === 0): //левый столбец
            neighborI = [-fieldWidth, 1, fieldWidth]
            break;
        case ((index + 1) % fieldWidth === 0): //правый столбец
            neighborI = [-fieldWidth, -1, fieldWidth];
            break;
        default: //обычные клетки 4 соседа
            neighborI = [-fieldWidth, -1, 1, fieldWidth];
            //console.log(currentIndex);
    }
    const cell = document.querySelector(`button[index="${index}"]`) as HTMLButtonElement;
    cell.setAttribute('data-value', "0");
    console.log(cell);
    neighborI.forEach(element => {
        if (arrField[index + element] === 0 && cell.getAttribute('data-value') !== "0" ){
            checkEmptyCell(index + element);
        }
    });
}
