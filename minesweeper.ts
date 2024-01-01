let fieldSize: number; // = 100; //всего клеток
let minesCount: number; //всего мин
let fieldWidth: number; //ширина поля
let arrField: number[]; //клетки с минами
let arrChecked: boolean[]; //клетки куда уже тыкали
let minesLeft: number;
const buttonsContainer = document.querySelector('.buttons');
const playerNameInput = document.getElementById('playerName');
const timeElapsedInput = document.getElementById('timeElapsed');
const minesLeftInput: HTMLInputElement = document.getElementById('minesLeft') as HTMLInputElement;


//// MultyWindows APP
// let uuid: string;
// let difficulty: string;
let gameStatus: number = 5; //5 new game; 0 game starting; 1 over; 2 win

///////////
function showElement(elementId: string) {
    document.getElementById(elementId).style.display = 'block';
}

function hideElement(elementId: string) {
    document.getElementById(elementId).style.display = 'none';
}

window.onload = () => {
    startNewGame()
}

function startNewGame(){
    const fieldSizeSlider = document.getElementById('fieldSize') as HTMLInputElement;
    const fieldSizeValueDisplay = document.getElementById('fieldSizeValue') as HTMLElement;

    fieldSizeSlider.oninput = () => {
        fieldSizeValueDisplay.textContent = fieldSizeSlider.value;
    };

    const gameSettingsForm = document.getElementById('gameSettings') as HTMLFormElement;
    gameSettingsForm.onsubmit = (event) => {
        event.preventDefault();

        let difficulty = (document.getElementById('difficulty') as HTMLSelectElement).value;
        fieldWidth = parseInt(fieldSizeSlider.value)
        const createGame = async (size: number, difficulty: string) => {
            try {
                const response = await fetch(`http://localhost:8080/newgame?difficulty=${difficulty}&size=${size}`);
                if (!response.ok) {
                    throw new Error('Ошибка при запросе к серверу');
                }
                const data = await response.json();
                // Обработка полученных данных
                startGame(parseInt(data.size), parseInt(data.mines), String(data.guid));
            } catch (error) {
                console.error('Ошибка при создании игры:', error);
            }
        };
        createGame(fieldWidth, difficulty)
    };

    // Другая логика игры
};

function startGame(fieldS: number, minesC: number, uuid: string): void {
    console.log(`Игра начата с размером поля ${fieldS} и сложностью ${minesCount}`);
    // Здесь должна быть логика для старта игры
    fieldSize = fieldS;
    arrField = new Array(fieldSize).fill(0);
    arrChecked = new Array(fieldSize).fill(false);
    minesCount = minesC;
    minesLeft = minesC;
    minesLeftInput.value = minesLeft.toString();

    //создаем кнопки
    buttonsContainer?.setAttribute('style', `grid-template-columns: repeat(${fieldWidth}, 1fr);`);
    arrField.forEach((value, index) => {
        // if (value !== 9 ){
        //     arrField[index] = checkMinesCount(index);
        // }
        const button = document.createElement('button');
        button?.setAttribute('index', index.toString());
        buttonsContainer?.appendChild(button);

        button.addEventListener('click', async function() {
            arrChecked[index] = true; //левая кнопка мыши
            const currentIndex = Number(this.getAttribute('index'));
            const currentMines = await getMines(currentIndex, uuid);
            if (this.textContent !== '⛳️'){ //проверяем на флажок
                if (currentMines === 9) {
                    const allMines: number[] = await getAllMines(uuid);
                    console.log(allMines);
                    for (let indBomb of allMines) {
                        const cell = document.querySelector(`button[index="${indBomb}"]`) as HTMLButtonElement;
                        cell.textContent = '💣';
                        cell?.setAttribute('data-value', '💣')
                    }
                    setTimeout(() => {
                        alert("Вы проиграли!");
                        location.reload();
                    }, 400);
                } else {  // выбираем соседей
                    //let mines: number = checkMinesCount(currentIndex);
                    if (currentMines !== 0) {
                        this.textContent = currentMines.toString()
                        //arrField[currentIndex] = mines;
                    } else {
                        this.textContent = '';
                        checkEmptyCell(currentIndex, uuid);
                        //this.setAttribute('checked', '0');
                    }
                    this.setAttribute('checked', '1');
                }
            }
            win();
        });
        button.addEventListener('contextmenu', function(event) {
            event.preventDefault(); //правая кнопка мыши
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
    //
    hideElement("startWindow")
    showElement("gameField")

}

async function getMines(index: number, uuid: string): Promise<number> {
    let mines: number;
    try {
        const response = await fetch(`http://localhost:8080/turn?guid=${uuid}&field=${index}`);
        if (!response.ok) {
            throw new Error('Ошибка при запросе к серверу');
        }
        const data = await response.json();
        // Обработка полученных данных
        mines = parseInt(data.mines)
        //console.log("Status game", data.gamestatus)
        //startGame(parseInt(data.size), parseInt(data.mines), String(data.guid));
    } catch (error) {
        console.error('Ошибка при создании игры:', error);
    }
    return new Promise(resolve => {
        setTimeout(() => resolve(mines), 10);
    });
}

async function getAllMines(uuid: string): Promise<number[]> {
    let mines: number[];
    try {
        const response = await fetch(`http://localhost:8080/gameover?guid=${uuid}`);
        if (!response.ok) {
            throw new Error('Ошибка при запросе к серверу');
        }
        const data = await response.json();
        // Обработка полученных данных
        mines = data.mines
        //startGame(parseInt(data.size), parseInt(data.mines), String(data.guid));
    } catch (error) {
        console.error('Ошибка при создании игры:', error);
    }
    return new Promise(resolve => {
        setTimeout(() => resolve(mines), 10);
    });
}
///////////

//win?
function win(): void {
    console.log(fieldSize)
    console.log(minesCount + arrChecked.filter(value => value === true).length)
    if (fieldSize === minesCount + arrChecked.filter(value => value === true).length) {
        setTimeout(() => {
            alert("You win!");
            location.reload();
        }, 400);
    }
}

//считаем пустые поля
async function checkEmptyCell(index: number, uuid: string) {
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
    //console.log(`Checkemptycell:`, index)
    for (const element of neighborI) {
        const cellIndex = index + element;
        const cell = document.querySelector(`button[index="${cellIndex}"]`) as HTMLButtonElement;
        if (!cell || arrChecked[cellIndex]) continue; // Если клетка уже проверена или не существует, переходим к следующей итерации

        const mines: number = await getMines(cellIndex, uuid);
        //console.log(`Checkemptycell mines:`, mines);

        if (mines === 0 /*&& checkMinesCount(cellIndex) === 0*/) {
            arrChecked[cellIndex] = true;
            cell.setAttribute('checked', '1');
            checkEmptyCell(cellIndex, uuid); //await?
        } else {
            arrChecked[cellIndex] = true;
            cell.textContent = mines.toString();
            cell.setAttribute('checked', '1');
        }
    };
}
