// Your code here
const Table = require('cli-table')
const chalk = require('chalk')
const readline = require('readline')
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

class Ship {
  constructor(name, size) {
    this.name = name
    this.size = size

    this.orientation = Math.floor(Math.random()*2) //0 for portrait, 1 for landscape
    this.ship = []
  }
}

class Board {
  constructor(size) {
    this.size = size
  }

  print(ships) {
    let tableHead = ['']
    let colWidths = [4]
    for(let i = 0; i < this.size; i++) {
        tableHead.push(String.fromCharCode(65 + i))
        colWidths.push(colWidths[0])
    }

    var table = new Table({
      head: tableHead,
      colWidths: colWidths
    })

    for(let i = 0; i < this.size; i++) {
      let arr = [i+1]

      for(let j = 0; j < this.size; j++) {
        let letter = j + 65
        let pos = String.fromCharCode(letter) + (i+1)

        let falseCond = ships.filter(item => {
          let checkFalse = item.ship.filter(item2 => {return item2.pos == pos && item2.cond == false})
          return checkFalse.length > 0
        })

        arr.push(falseCond.length > 0 ? chalk.red('X') : '')

      }

      table.push(arr)
    }

    return table.toString()
  }
}

class Game {
  constructor(size) {
    this.board = new Board(size)
    this.ships = []

    this.filled = []
  }

  addShip(name, size) {
    this.ships.push(new Ship(name, size))
  }

  arrangeShips() {
    let filledPos = []

    for (let ship = 0; ship < this.ships.length; ship++) {
      let randI = Math.floor(Math.random()*this.board.size) + 1
      let randJ = Math.floor(Math.random()*this.board.size)

      this.ships[ship].ship = []
      for (let shipPoint = 0; shipPoint < this.ships[ship].size; shipPoint++) {
        let strPos = String.fromCharCode(randJ + 65) + randI

        if (
            filledPos.indexOf(strPos) < 0 &&
            randI < this.board.size &&
            randJ < this.board.size
        ) {
          filledPos.push(strPos)

          let obj = {
            pos: strPos,
            cond: false
          }
          this.ships[ship].ship.push(obj)

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

  }

  play() {
    this.arrangeShips()

    // for (let i = 0; i < 5; i++)
    // console.log(this.ships[i]);

    console.log(this.board.print(this.ships));
  }

  turn() {

  }

}

let game = new Game(10)
game.addShip('Carrier', 5)
game.addShip('Battleship', 4)
game.addShip('Cruiser', 3)
game.addShip('Submarine', 3)
game.addShip('Destroyer', 2)

game.play()
