var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fieldSize; // = 100; //всего клеток
var minesCount; //всего мин
var fieldWidth; //ширина поля
var arrField; //клетки с минами
var arrChecked; //клетки куда уже тыкали
var minesLeft;
var buttonsContainer = document.querySelector('.buttons');
var playerNameInput = document.getElementById('playerName');
var timeElapsedSpan = document.getElementById('timeElapsed');
;
var minesLeftSpan = document.getElementById('minesLeft');
var secondsElapsed = 0;
var timerInterval;
//// MultyWindows APP
// let uuid: string;
// let difficulty: string;
var gameStatus = 5; //5 new game; 0 game starting; 1 over; 2 win
///////////
function showElement(elementId) {
    document.getElementById(elementId).style.display = 'block';
}
function hideElement(elementId) {
    document.getElementById(elementId).style.display = 'none';
}
window.onload = function () {
    startNewGame();
};
function startNewGame() {
    var _this = this;
    var fieldSizeSlider = document.getElementById('fieldSize');
    var fieldSizeValueDisplay = document.getElementById('fieldSizeValue');
    fieldSizeSlider.oninput = function () {
        fieldSizeValueDisplay.textContent = fieldSizeSlider.value;
    };
    var gameSettingsForm = document.getElementById('gameSettings');
    gameSettingsForm.onsubmit = function (event) {
        event.preventDefault();
        var difficulty = document.getElementById('difficulty').value;
        fieldWidth = parseInt(fieldSizeSlider.value);
        var createGame = function (size, difficulty) { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("http://ms.justmy.site/newgame?difficulty=".concat(difficulty, "&size=").concat(size))];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error('Ошибка при запросе к серверу');
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        // Обработка полученных данных
                        startGame(parseInt(data.size), parseInt(data.mines), String(data.guid));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Ошибка при создании игры:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        createGame(fieldWidth, difficulty);
    };
    // Другая логика игры
}
;
function startGame(fieldS, minesC, uuid) {
    console.log("\u0418\u0433\u0440\u0430 \u043D\u0430\u0447\u0430\u0442\u0430 \u0441 \u0440\u0430\u0437\u043C\u0435\u0440\u043E\u043C \u043F\u043E\u043B\u044F ".concat(fieldS, " \u0438 \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C\u044E ").concat(minesC));
    // Здесь должна быть логика для старта игры
    startTimer();
    fieldSize = fieldS;
    arrField = new Array(fieldSize).fill(0);
    arrChecked = new Array(fieldSize).fill(false);
    minesCount = minesC;
    minesLeft = minesC;
    minesLeftSpan.textContent = minesLeft.toString();
    //создаем кнопки
    buttonsContainer === null || buttonsContainer === void 0 ? void 0 : buttonsContainer.setAttribute('style', "grid-template-columns: repeat(".concat(fieldWidth, ", 1fr);"));
    arrField.forEach(function (value, index) {
        // if (value !== 9 ){
        //     arrField[index] = checkMinesCount(index);
        // }
        var button = document.createElement('button');
        button === null || button === void 0 ? void 0 : button.setAttribute('index', index.toString());
        buttonsContainer === null || buttonsContainer === void 0 ? void 0 : buttonsContainer.appendChild(button);
        button.addEventListener('click', function () {
            return __awaiter(this, void 0, void 0, function () {
                var currentIndex, currentMines, allMines, _i, allMines_1, indBomb, cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            arrChecked[index] = true; //левая кнопка мыши
                            currentIndex = Number(this.getAttribute('index'));
                            return [4 /*yield*/, getMines(currentIndex, uuid)];
                        case 1:
                            currentMines = _a.sent();
                            if (!(this.textContent !== '⛳️')) return [3 /*break*/, 4];
                            if (!(currentMines === 9)) return [3 /*break*/, 3];
                            return [4 /*yield*/, getAllMines(uuid)];
                        case 2:
                            allMines = _a.sent();
                            console.log(allMines);
                            for (_i = 0, allMines_1 = allMines; _i < allMines_1.length; _i++) {
                                indBomb = allMines_1[_i];
                                cell = document.querySelector("button[index=\"".concat(indBomb, "\"]"));
                                cell.textContent = '💣';
                                cell === null || cell === void 0 ? void 0 : cell.setAttribute('data-value', '💣');
                            }
                            setTimeout(function () {
                                alert("Вы проиграли!");
                                location.reload();
                            }, 400);
                            return [3 /*break*/, 4];
                        case 3:
                            //let mines: number = checkMinesCount(currentIndex);
                            if (currentMines !== 0) {
                                this.textContent = currentMines.toString();
                                //arrField[currentIndex] = mines;
                            }
                            else {
                                this.textContent = '';
                                checkEmptyCell(currentIndex, uuid);
                                //this.setAttribute('checked', '0');
                            }
                            this.setAttribute('checked', '1');
                            _a.label = 4;
                        case 4:
                            win();
                            return [2 /*return*/];
                    }
                });
            });
        });
        button.addEventListener('contextmenu', function (event) {
            event.preventDefault(); //правая кнопка мыши
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
            minesLeftSpan.textContent = minesLeft.toString();
            win();
        });
    });
    //
    hideElement("startWindow");
    showElement("gameField");
}
function getMines(index, uuid) {
    return __awaiter(this, void 0, void 0, function () {
        var mines, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("http://ms.justmy.site/turn?guid=".concat(uuid, "&field=").concat(index))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Ошибка при запросе к серверу');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    // Обработка полученных данных
                    mines = parseInt(data.mines);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Ошибка при создании игры:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () { return resolve(mines); }, 10);
                    })];
            }
        });
    });
}
function getAllMines(uuid) {
    return __awaiter(this, void 0, void 0, function () {
        var mines, response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("http://ms.justmy.site/gameover?guid=".concat(uuid))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Ошибка при запросе к серверу');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    // Обработка полученных данных
                    mines = data.mines;
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Ошибка при создании игры:', error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, new Promise(function (resolve) {
                        setTimeout(function () { return resolve(mines); }, 10);
                    })];
            }
        });
    });
}
///////////
//win?
function win() {
    if (fieldSize === minesCount + arrChecked.filter(function (value) { return value === true; }).length) {
        stopTimer();
        setTimeout(function () {
            alert("You win!");
            location.reload();
            // hideElement("gameField")
            // showElement("fireworkContainer")
            // createFirework();
        }, 400);
    }
}
function startTimer() {
    timerInterval = setInterval(function () {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
}
function stopTimer() {
    clearInterval(timerInterval);
}
function updateTimerDisplay() {
    var minutes = Math.floor(secondsElapsed / 60);
    var seconds = secondsElapsed % 60;
    var formattedTime = "".concat(minutes.toString().padStart(2, '0'), ":").concat(seconds.toString().padStart(2, '0'));
    // Обновите элемент отображения таймера на вашей веб-странице
    var timDisplay = document.getElementById('timerDisplay');
    timDisplay.textContent = formattedTime;
}
//считаем пустые поля
function checkEmptyCell(index, uuid) {
    return __awaiter(this, void 0, void 0, function () {
        var neighborI, _i, neighborI_1, element, cellIndex, cell, mines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    neighborI = [];
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
                    _i = 0, neighborI_1 = neighborI;
                    _a.label = 1;
                case 1:
                    if (!(_i < neighborI_1.length)) return [3 /*break*/, 4];
                    element = neighborI_1[_i];
                    cellIndex = index + element;
                    cell = document.querySelector("button[index=\"".concat(cellIndex, "\"]"));
                    if (!cell || arrChecked[cellIndex])
                        return [3 /*break*/, 3]; // Если клетка уже проверена или не существует, переходим к следующей итерации
                    return [4 /*yield*/, getMines(cellIndex, uuid)];
                case 2:
                    mines = _a.sent();
                    //console.log(`Checkemptycell mines:`, mines);
                    if (mines === 0 /*&& checkMinesCount(cellIndex) === 0*/) {
                        arrChecked[cellIndex] = true;
                        cell.setAttribute('checked', '1');
                        checkEmptyCell(cellIndex, uuid); //await?
                    }
                    else {
                        arrChecked[cellIndex] = true;
                        cell.textContent = mines.toString();
                        cell.setAttribute('checked', '1');
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    ;
                    return [2 /*return*/];
            }
        });
    });
}
function createFirework() {
    console.log("Firework!");
    var fireworkContainer = document.getElementById('fireworkContainer'); // контейнер для салюта
    var _loop_1 = function (i) {
        var particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = "".concat(Math.random() * 100, "%");
        particle.style.top = "".concat(Math.random() * 100, "%");
        particle.style.backgroundColor = getRandomColor();
        fireworkContainer === null || fireworkContainer === void 0 ? void 0 : fireworkContainer.appendChild(particle);
        // Удалите частицу после анимации
        particle.addEventListener('animationend', function () {
            particle.remove();
        });
    };
    for (var i = 0; i < 50; i++) {
        _loop_1(i);
    }
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
