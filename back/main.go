package main

import (
	"fmt"
	"log"
	"math"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
)

type mineField struct{
	//guid string
	size int
	difficult byte //0, 2, 4
	userName string
	gameDuration int
	cells []byte
	gameStartTime time.Time
	currentStatus byte
}

var allGames map[string]mineField

// Print field to console
func (mf *mineField) printToConsole(){
	width := int(math.Sqrt(float64(mf.size)))
	for i := 0; i < width; i++ {
		for u := 0; u < width; u++ {
			fmt.Printf("%v ", mf.cells[(i*10)+u])
		}
		fmt.Printf("\n")
	}
}
// Return field to string
func (mf *mineField) printToString() string {
	width := int(math.Sqrt(float64(mf.size)))
	result := []string{}
	for i := 0; i < width; i++ {
		for u := 0; u < width; u++ {
			result = append(result, fmt.Sprintf("%v ", mf.cells[(i*width)+u]))
		}
		result = append(result, "\n")
	}
	return strings.Join(result, "")
}
// Return cell value by Index
func (mf *mineField) getCellValue(index int) byte {
	return mf.cells[index]
}
// Create new field struct
func newMineField(size int, difficult byte) mineField {
	mineCount := int(math.Sqrt(float64(size)) + ((float64(size) / 100) * float64(difficult)))
	//fmt.Println(mineCount)
	arrField := make([]byte, size)
	fillMines(mineCount, &arrField)
	fillCell(&arrField)
	return mineField{
		size: size,
		difficult: difficult,
		userName: "",
		gameDuration: 0,
		cells: arrField,
		gameStartTime: time.Now(),
		currentStatus: 0,
	}
}
// Fill field of mines
func fillMines(count int, arrField *[]byte) {
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
		if index == 0 { //LT corner
			arrNeib = []int{1, width, width + 1}
		} else if index == width-1 { //RT corner
			arrNeib = []int{-1, width, width - 1}
		} else if index == size - width { //LD corner
			arrNeib =[]int{1, -width, -width + 1}
		} else if index == size - 1 { //RD corner
			arrNeib = []int{-1, -width, -width - 1}
		} else if index < width { //Top line, except corners
			arrNeib = []int{-1, 1, width, width - 1, width + 1}
		} else if index > size - width { //Lower line, except corners
			arrNeib = []int{-1, 1, -width, -width - 1, -width + 1}
		} else if index%width == 0 { //Left row, except corners
			arrNeib = []int{1, width, -width, -width + 1, width + 1}
		} else if index%width == width - 1 { //Right row, except corners
			arrNeib = []int{-1, -width, width, -width - 1, width - 1}
		}else { //default
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
	port := 8080
	addr := fmt.Sprintf(":%v", port)
	fmt.Println("......")
	// field1 := newMineField(100, 0)
	// fmt.Println(field1.getCellValue(0))
	// fmt.Println(field1.guid)
	// fmt.Println("......")

	// -- Handlers
	http.HandleFunc("/newgame", func(w http.ResponseWriter, r *http.Request) {
		difficult, _ := strconv.Atoi(r.URL.Query().Get("difficult"))
		size, _ := strconv.Atoi(r.URL.Query().Get("size"))
		//TODO Добавить проверку типов полей
		field2 := newMineField(size * size, byte(difficult))
		guid := uuid.NewString()
		allGames[guid] = field2
		fmt.Fprint(w, field2.printToString())
		log.Printf("New game %s started in %s!\n", guid, field2.gameStartTime)
		log.Println("---")
		log.Println(allGames)
	})
	http.HandleFunc("/turn", func(w http.ResponseWriter, r *http.Request) {
		guid := r.URL.Query().Get("guid")
		field, _ := strconv.Atoi(r.URL.Query().Get("field"))
		if _, ok := allGames[guid]; ok {
			if field < len(allGames[guid].cells) {
				fmt.Fprint(w, allGames[guid].cells[field])
			}
		} else {
			//return Game not found

		}
	})

	fmt.Printf("Starting server on %v port...\n", port)
	http.ListenAndServe(addr, nil)
}
