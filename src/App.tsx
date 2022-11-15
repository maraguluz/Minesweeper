import React, { useState } from 'react'

export function App() {
  const [game, setGame] = useState<Game>({
    id: null,
    winner: null,
    //state: null,
    board: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
    //let board = Array(8).fill(0).map(row => new Array(8).fill(null))
  })
  type Square = 'X' | 'O' | ' '
  type Row = [Square, Square, Square, Square, Square, Square, Square, Square]
  type Board = [Row, Row, Row, Row, Row, Row, Row, Row]
  type Game = {
    board: Board
    id: number | null
    winner: null | string
  }

  // type Cell =
  //   | ' '
  //   | '_'
  //   | 'F'
  //   | '*'
  //   | '@'
  //   | '1'
  //   | '2'
  //   | '3'
  //   | '4'
  //   | '5'
  //   | '6'
  //   | '7'
  //   | '8'
  // type Row = 8cells
  // type Board = rows
  // type Game = {
  //   board: Board
  //   id: null | number
  //   winner: null | string
  //   state: null | string
  // }

  async function handleNewGame() {
    const response = await fetch(
      'https://minesweeper-api.herokuapp.com/games',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }
    )

    if (response.ok) {
      // Get the response as JSON
      const newGame = await response.json()
      // Make that the new state!
      setGame(newGame)
    }
  }

  async function handleLeftClickCell(row: number, col: number) {
    const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/check`

    const body = { row, col }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    setGame(await response.json())
  }

  async function handleRightClickCell(row: number, col: number) {
    const url = `https://minesweeper-api.herokuapp.com/games/${game.id}/flag`

    const body = { row, col }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    setGame(await response.json())
  }

  return (
    <div>
      <h1 className="glitch">MINESWEEPER</h1>
      <div className="difficulties">
        <button className="difficult">Difficult</button>
        <button className="medium">Medium</button>
        <button className="easy">Easy</button>
      </div>

      <ul>
        {game.board.map((row, rowIndex) =>
          row.map((column, columnIndex) => (
            <li
              onClick={() => {
                handleLeftClickCell(rowIndex, columnIndex)
              }}
              key={column}
            >
              {column}
            </li>
          ))
        )}
      </ul>
      <footer>
        <button onClick={handleNewGame} className="glow-on-hover" type="button">
          NEW GAME
        </button>
      </footer>
    </div>
  )
}
