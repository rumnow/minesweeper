package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"math/rand"
	"net/http"
	"strconv"
	"sync"

	//"strings"
	"time"

	"github.com/google/uuid"
)

type mineField struct {
	//guid string
	size int
	mines int
	difficult byte //0, 2, 4
	userName string
	gameDuration int
	cells []byte
	chrono []turnsChrono
	currentStatus byte //5 new game; 0 game starting; 1 over; 2 win
}

func (mf *mineField) addChrono(tC turnsChrono) {
	mf.chrono = append(mf.chrono, tC)
}

type turnsChrono struct {
	cellIndex int
	turnTime time.Time
}

var allGames map[string]mineField
var mutex sync.Mutex // 1 mutex for all 8-(

// Create new field struct
func newMineField(size int, difficult byte) mineField {
	mineCount := int(math.Sqrt(float64(size)) + ((float64(size) / 100) * float64(difficult)))
	//fmt.Println(mineCount)
	arrField := make([]byte, size)
	zeroChrono := make([]turnsChrono, 0)
	fillMines(mineCount, &arrField)
	fillCell(&arrField)
	return mineField{
		size: size,
		mines: mineCount,
		difficult: difficult,
		userName: "",
		gameDuration: 0,
		cells: arrField,
		chrono: zeroChrono,
		currentStatus: 5,
	}
}
// Fill field of mines
func fillMines(count int, arrField *[]byte) {
	//log.Println("Count:", count, "array:", *arrField)
	if count == 0 {
		return
	}
	arr := *arrField
	r := rand.Intn(len(arr))
	if arr[r] != 9 {
		arr[r] = 9
		fillMines(count-1, &arr)
	} else {
		fillMines(count, &arr)
	}
}
// Calculate whole field
func fillCell(arrField *[]byte) {
	arr := *arrField
	size := len(arr)
	for index := 0; index < size; index++ {
		if arr[index] == 9 {
			continue
		}
		width := int(math.Sqrt(float64(size)))
		result := 0
		var arrNeib []int
		switch {
		case index == 0:  //LT corner
			arrNeib = []int{1, width, width + 1}
		case index == width - 1:  //RT corner
			arrNeib = []int{-1, width, width - 1}
		case index == size - width:  //LD corner
			arrNeib =[]int{1, -width, -width + 1}
		case index == size - 1: //RD corner
			arrNeib = []int{-1, -width, -width - 1}
		case index < width: //Top line, except corners
			arrNeib = []int{-1, 1, width, width - 1, width + 1}
		case index > size - width: //Lower line, except corners
			arrNeib = []int{-1, 1, -width, -width - 1, -width + 1}
		case index%width == 0:  //Left row, except corners
			arrNeib = []int{1, width, -width, -width + 1, width + 1}
		case index%width == width - 1: //Right row, except corners
			arrNeib = []int{-1, -width, width, -width - 1, width - 1}
		default:
			arrNeib = []int{-1, 1, -width, -width - 1, -width + 1, width, width - 1, width + 1}
		}
		for _, i := range arrNeib {
			if arr[index + i] == 9 {
				result++
			}
		}
		arr[index] = byte(result)
	}
}

func main() {
	allGames = make(map[string]mineField)
	port := 80
	addr := fmt.Sprintf(":%v", port)
	fmt.Println("......")

	// -- Handlers
	http.HandleFunc("/newgame", handleNewGame)
	http.HandleFunc("/turn", handleTurn)
	http.HandleFunc("/gameover", handleGameOver)

	fmt.Printf("Starting server on %v port...\n", port)
	http.ListenAndServe(addr, nil)
}

func handleNewGame(w http.ResponseWriter, r *http.Request) {
	type newGame struct {
		Size int `json:"size"`
		Mines int `json:"mines"`
		Guid string `json:"guid"`
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	difficult := r.URL.Query().Get("difficulty")
	size, _ := strconv.Atoi(r.URL.Query().Get("size"))
	//TODO Добавить проверку типов полей
	var field2 mineField
	switch {
	case difficult == "medium":
		field2 = newMineField(size * size, byte(2))
	case difficult == "hard":
		field2 = newMineField(size * size, byte(4))
	case difficult == "pro":
		field2 = newMineField(size * size, byte(9))
	default:
		field2 = newMineField(size * size, byte(0))
	}
	guid := uuid.NewString()
	allGames[guid] = field2
	answerNewGame, _ := json.Marshal(&newGame{size*size, field2.mines, guid})
	w.WriteHeader(200)
	w.Write(answerNewGame)
	log.Printf("New game %s started in %s!\n", guid, time.Now())
}

func handleTurn(w http.ResponseWriter, r *http.Request) {
	type turn struct {
		GameStatus int `json:"gamestatus"`
		Index int `json:"indexfield"`
		Mines int `json:"mines"`
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	guid := r.URL.Query().Get("guid")
	field, _ := strconv.Atoi(r.URL.Query().Get("field"))
	if mf, ok := allGames[guid]; ok {
		if mf.currentStatus == 5 { //if its first turn
			mf.currentStatus = 0
		}
		if field < len(mf.cells) {
			currentTurn := &turnsChrono{field, time.Now()}
			mf.addChrono(*currentTurn)
			answerTurn, _ := json.Marshal(&turn{int(mf.currentStatus), field, int(mf.cells[field])})
			w.Write(answerTurn)
			if int(mf.cells[field]) == 9 {
				mf.currentStatus = byte(1)
			}
			mutex.Lock()
			allGames[guid] = mf
			mutex.Unlock()
		}
	} else {
		//return Game not found
		w.WriteHeader(http.StatusNotFound)
	}
	log.Printf("%v", allGames)
}

func handleGameOver(w http.ResponseWriter, r *http.Request) {
	type allMines struct {
		Mines []int `json:"mines"`
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	guid := r.URL.Query().Get("guid")
	returnMines := allMines{}
	if mf, ok := allGames[guid]; ok {
		for i, v := range allGames[guid].cells {
			if v == 9 {
				returnMines.Mines = append(returnMines.Mines, i)
			}
		}
		answerGameOver, _ := json.Marshal(&returnMines)
		w.Write(answerGameOver)
		mutex.Lock()
		allGames[guid] = mf
		mutex.Unlock()
	} else {
		//return Game not found
		w.WriteHeader(http.StatusNotFound)
	}
}
