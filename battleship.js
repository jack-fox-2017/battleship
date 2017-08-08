// Your code here
const Table = require('cli-table')
const chalk = require('chalk')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Ship {
    constructor(name, size) {
        this.name = name
        this.size = size

        this.orientation = Math.floor(Math.random() * 2) //0 for portrait, 1 for landscape
        this.ship = []
    }
}

class Board {
    constructor(size) {
        this.size = size
    }

    print(ships, grid) {
        let tableHead = ['']
        let colWidths = [4]
        for (let i = 0; i < this.size; i++) {
            tableHead.push(String.fromCharCode(65 + i))
            colWidths.push(colWidths[0])
        }

        var table = new Table({
            head: tableHead,
            colWidths: colWidths
        })

        for (let i = 0; i < this.size; i++) {
            let arr = [i + 1]

            for (let j = 0; j < this.size; j++) {
                let letter = j + 65
                let pos = String.fromCharCode(letter) + (i + 1)

                let falseCond = ships.filter(item => {
                    let checkFalse = item.ship.filter(item2 => {
                        return item2.pos == pos && item2.cond == false
                    })
                    return checkFalse.length > 0
                })

                arr.push(falseCond.length > 0 ? chalk.red('X') : (!grid[i][j].haveShip && !grid[i][j].condition ? 'X' : ''))
            }

            table.push(arr)
        }

        return table.toString()
    }

    static arrBoard(size) {
        let result = []

        for (let i = 0; i < size; i++) {
            result.push([])
            for (let j = 0; j < size; j++)
                result[i].push({
                    haveShip: false,
                    condition: true
                })
        }

        return result
    }
}

class Game {
    constructor(size) {
        this.board = new Board(size)
        this.ships = []

        this.grid = Board.arrBoard(10)
        this.filled = []
        this.guessed = []
    }

    addShip(name, size) {
        this.ships.push(new Ship(name, size))
    }

    arrangeShips() {
        let filledPos = []

        for (let ship = 0; ship < this.ships.length; ship++) {
            let randI = Math.floor(Math.random() * this.board.size) + 1
            let randJ = Math.floor(Math.random() * this.board.size)

            this.ships[ship].ship = []
            for (let shipPoint = 0; shipPoint < this.ships[ship].size; shipPoint++) {
                let strPos = String.fromCharCode(randJ + 65) + randI

                if (
                    filledPos.indexOf(strPos) < 0 &&
                    randI < this.board.size &&
                    randJ < this.board.size
                ) {
                    filledPos.push(strPos)

                    this.ships[ship].ship.push({
                        pos: strPos,
                        cond: true
                    })

                    //landscape
                    if (this.ships[ship].orientation) randJ++
                        //portrait
                        else randI++
                } else {
                    this.ships[ship].ship = []

                    if (ship > 0) {
                        filledPos.splice(filledPos.length - ship, ship)
                        ship -= 2
                    } else {
                        filledPos = []
                        ship = -1
                    }

                    break
                }
            }
        }

        this.ships.forEach(ship => {
            ship.ship.forEach(tile => {
                let ij = this.posToIJ(tile.pos)
                this.grid[ij[0]][ij[1]].haveShip = true
            })
        })

    }

    ijToPos(i, j) {

    }

    posToIJ(str) {
        if (str.length == 2) {
            let split = str.split('')

            let i = Number(split[1]) - 1
            let j = split[0].charCodeAt(0) - 65

            return [i, j]
        } else
            return false
    }

    play() {
        this.arrangeShips()
        console.log(JSON.stringify(this.ships, null, 2))
        console.log(this.board.print(this.ships, this.grid));

        // console.log(this.grid);
        this.turn()
    }

    guess(pos) {
        let ij = this.posToIJ(pos)
        if (this.grid[ij[0]][ij[1]].haveShip) {
          this.ships.forEach(ship => {
            ship.ship.forEach(block => {
              if (block.pos == pos) {
                block.cond = false
              }
            })
          })
        } else {
          this.grid[ij[0]][ij[1]].condition = false
        }g6G6

    }

    turn() {
      rl.question('Guess position: ', input => {
        this.guess(input)
        console.log(this.board.print(this.ships, this.grid));

        this.turn()
      })
    }

}

let game = new Game(10)
game.addShip('Carrier', 5)
game.addShip('Battleship', 4)
game.addShip('Cruiser', 3)
game.addShip('Submarine', 3)
game.addShip('Destroyer', 2)

game.play()
