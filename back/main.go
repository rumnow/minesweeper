package main

import (
	"context"
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
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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
	CellIndex int
	TurnTime time.Time
}

var allGames map[string]mineField
var mutex sync.Mutex // 1 mutex for all 8-(
var mongoClient *mongo.Client
var mongoDB *mongo.Database

func main() {
	defer func() {
		err := mongoClient.Disconnect(context.TODO())
		if err != nil {
			log.Fatal(err)
		}
	}()
	var err error
	allGames = make(map[string]mineField)
	port := 80
	addr := fmt.Sprintf(":%v", port)
	opts := options.Client().ApplyURI("mongodb://localhost:27017/?directConnection=true&serverSelectionTimeoutMS=2000")
	mongoClient, err = mongo.Connect(context.TODO(), opts)
	if err != nil {
		log.Fatal(err)
	}
	err = mongoClient.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}
	mongoDB = mongoClient.Database("minesweeper")
	//mongoCollection = database.Collection("collection-name")
	fmt.Println("Connected to MongoDB!")
	fmt.Println("......")

	// -- Handlers ##########################
	http.HandleFunc("/newgame", handleNewGame)
	http.HandleFunc("/turn", handleTurn)
	http.HandleFunc("/gameover", handleGameOver)
	http.HandleFunc("/win", handleWin)
	// -- ###################################
	fmt.Printf("Starting server on %v port...\n", port)
	http.ListenAndServe(addr, nil)
}

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

func handleWin(w http.ResponseWriter, r *http.Request) {
	type winGame struct {
		Duration int `json:"duration"`
		Position int `json:"position"`
		Rating []string `json:"rating"`
	}
	wg := winGame{}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	guid := r.URL.Query().Get("guid")
	if mf, ok := allGames[guid]; ok {
		//log.Println("WIN", guid, len(mf.cells), "=", len(mf.chrono) + mf.mines)
		//if len(mf.cells) == len(mf.chrono) + mf.mines { //really win?
		mf.currentStatus = 2
		mf.gameDuration = int(mf.chrono[len(mf.chrono)-1].TurnTime.Sub(mf.chrono[0].TurnTime).Milliseconds())
		mutex.Lock()
		allGames[guid] = mf
		mutex.Unlock()
		saveGame(guid)
		wg = winGame{mf.gameDuration, 4, []string{"s1", "s2", "s3"}}
		answerWin, _ := json.Marshal(&wg)
		w.Write(answerWin)
	}
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
			//log.Printf(":%v", int(mf.chrono[len(mf.chrono)-1].turnTime.Sub(mf.chrono[0].turnTime).Milliseconds()))
		}
	} else {
		//return Game not found
		w.WriteHeader(http.StatusNotFound)
	}
}

// save game with guid to DB
func saveGame(guid string) {
	type mongoMf struct {
		Uuid string `json:"uuid"`
		Size int `json:"size"`
		Mines int `json:"mines"`
		Difficult byte `json:"difficult"`
		GameDuration int `json:"gameduration"`
		Cells []byte `json:"cells"`
		Chrono []turnsChrono `json:"chrono"`
		CurrentStatus byte `json:"gamestatus"`
	}
	if mf, ok := allGames[guid]; ok {
		mongoCollection := mongoDB.Collection("turns")
        mongoMF := &mongoMf{
            Uuid:         guid,
            Size:         mf.size,
            Mines:        mf.mines,
            Difficult:    mf.difficult,
            GameDuration: mf.gameDuration,
            Cells:        mf.cells,
            Chrono:       mf.chrono,
            CurrentStatus: mf.currentStatus,
        }
		_, err := mongoCollection.InsertOne(context.TODO(), mongoMF)
        if err != nil {
            log.Printf("Failed to save game %s: %v", guid, err)
            return
        }
        log.Printf("Game %s saved successfully!", guid)
    } else {
        log.Printf("Game %s not found in allGames", guid)
    }
}


func handleGameOver(w http.ResponseWriter, r *http.Request) {
	type allMines struct {
		Mines []int `json:"mines"`
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	guid := r.URL.Query().Get("guid")
	returnMines := allMines{}
	if mf, ok := allGames[guid]; ok {
		mf.gameDuration = int(mf.chrono[len(mf.chrono)-1].TurnTime.Sub(mf.chrono[0].TurnTime).Milliseconds())
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
		saveGame(guid)
	} else {
		//return Game not found
		w.WriteHeader(http.StatusNotFound)
	}
}
