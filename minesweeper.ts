const fieldSize = 100; //всего клеток
const minesCount: number = 10; //всего мин
const fieldWidth = Math.sqrt(fieldSize); //ширина поля
let arrField: number[] = new Array(fieldSize).fill(0); //клетки с минами
const arrChecked: boolean[] = new Array(fieldSize).fill(false); //клетки куда уже тыкали
let minesLeft: number = minesCount;
const buttonsContainer = document.querySelector('.buttons');
const playerNameInput = document.getElementById('playerName');
const timeElapsedInput = document.getElementById('timeElapsed');
const minesLeftInput: HTMLInputElement = document.getElementById('minesLeft') as HTMLInputElement;
minesLeftInput.value = minesCount.toString();
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
//считаем соседей
// for (let [index, value] of arrField.entries()){
//     if (value !== 9 ){
//         arrField[index] = checkMinesCount(index);
//     }
// }
//console.log(arrField);
//создаем кнопки
buttonsContainer?.setAttribute('style', `grid-template-columns: repeat(${fieldWidth}, 1fr);`);
arrField.forEach((value, index) => {
    if (value !== 9 ){
        arrField[index] = checkMinesCount(index);
        //console.log(arrField[index]);
    }
    const button = document.createElement('button');
    button?.setAttribute('index', index.toString());
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
                        cell?.setAttribute('data-value', '💣');
                    }
                }
            } else {  // выбираем соседей
                let currentIndex = Number(this.getAttribute('index'));
                let mines: number = checkMinesCount(currentIndex);
                if (mines !== 0) {
                    this.textContent = mines.toString()
                    arrField[currentIndex] = mines;
                } else {
                    this.textContent = '';
                    checkEmptyCell(currentIndex);
                    //this.setAttribute('checked', '0');
                }
                this.setAttribute('checked', '1');
            }
        }
        win();
    });
    button.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        if (this.textContent === '⛳️') {
            if (this.getAttribute('checked') === '1' && arrField[index] > 0) {
                this.textContent = arrField[index].toString();
            } else {
                this.textContent = '';
            }
            minesLeft++;
        } else if (minesLeft > 0){
            this.textContent = '⛳️';
            minesLeft--;
        }
        minesLeftInput.value = minesLeft.toString();
        win();
    });
});
//win?
function win(): void {
    if (fieldSize === minesCount + arrChecked.filter(value => value === true).length) {
        alert('You win!');
    }
}
//считаем соседние мины рядом
function checkMinesCount(index: number): number {
    let mines: number = 0;
    let neighborI: number[] = [];
    switch (true){
        case (index === 0): //левый верхний угол
            neighborI = [1, fieldWidth, fieldWidth+1];
            break;
        case (index === fieldWidth-1): //правый верхний угол
            neighborI = [-1, fieldWidth, fieldWidth-1];
            break;
        case (index < fieldWidth): //верхняя строка
            neighborI = [-1, 1, fieldWidth, fieldWidth-1, fieldWidth+1];
            break;
        case (index === fieldSize-fieldWidth): //левый нижний угол
            neighborI = [1, -fieldWidth, -fieldWidth+1];
            break;
        case (index === fieldSize-1): //правый нижний угол
            neighborI = [-1, -fieldWidth, fieldWidth-1];
            break;
        case (index > fieldSize - fieldWidth): //нижняя строка
            neighborI = [-1, 1, -fieldWidth, -fieldWidth-1, -fieldWidth+1];
            break;
        case ((index) % fieldWidth === 0): //левый столбец
            neighborI = [-fieldWidth, -fieldWidth+1, 1, fieldWidth, fieldWidth+1]
            break;
        case ((index + 1) % fieldWidth === 0): //правый столбец
            neighborI = [-fieldWidth-1, -fieldWidth, -1, fieldWidth, fieldWidth-1];
            break;
        default: //обычные клетки 8 соседей
            neighborI = [-fieldWidth-1, -fieldWidth, -fieldWidth+1, -1, 1,
                fieldWidth, fieldWidth-1, fieldWidth+1];
    }
    neighborI.forEach(element => { //расчитываем количество мин вокруг
        if (arrField[index + element] === 9){
            mines++;
        }
    });
    return mines;
}
//считаем пустые поля
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
    neighborI.forEach(element => {
        const cell: HTMLButtonElement =
        document.querySelector(`button[index="${index+element}"]`) as HTMLButtonElement;
        if (arrField[index + element] === 0 && !arrChecked[index + element]
                                            && checkMinesCount(index + element) === 0 ){
            arrChecked[index + element] = true;
            cell?.setAttribute('checked', '1');
            checkEmptyCell(index + element);
        } else if (arrField[index + element] !== 0 && !arrChecked[index + element] ){
            arrChecked[index + element] = true;
            cell.textContent = arrField[index + element].toString(); //checkMinesCount(index + element).toString()
            cell?.setAttribute('checked', '1');
        }
    });
}
