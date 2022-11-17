import React, { useState } from 'react'

export function App() {
  const [game, setGame] = useState<Game>({
    id: null,
    winner: null,
    board: [],
  })
  type Cell =
    | ' '
    | '_'
    | 'F'
    | '*'
    | '@'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
  type Row = Array<Cell>
  type Board = Array<Row>
  type Game = {
    board: Board
    id: number | null
    winner: null | string
  }

  async function handleNewGame(difficulty: number) {
    const response = await fetch(
      `https://minesweeper-api.herokuapp.com/games?difficulty=${difficulty}}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ difficulty }),
      }
    )

    if (response.ok) {
      const newGame = await response.json()

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

  function transformCellClassName(value: string | number) {
    switch (value) {
      case 'F':
        return 'cell-flag'

      case '*':
        return 'cell-bomb'

      case '_':
        return 'cell-free'
    }
    if ([1, 2, 3, 4, 5, 6, 7, 8].includes(Number(value))) {
      return `cell-number cell-${value}`
    }
    return undefined
  }
  return (
    <div>
      <h1 className="glitch">MINESWEEPER</h1>

      <div className="difficulties">
        <button onClick={() => handleNewGame(0)} className="easy">
          EASY
        </button>
        <button onClick={() => handleNewGame(1)} className="medium">
          MEDIUM
        </button>
        <button onClick={() => handleNewGame(2)} className="difficult">
          DIFFICULT
        </button>
      </div>

      <ul className={`difficulty-${game.board.length}`}>
        {game.board.map((row, rowIndex) =>
          row.map((column, columnIndex) => (
            <li
              onClick={() => {
                handleLeftClickCell(rowIndex, columnIndex)
              }}
              onContextMenu={(event) => {
                event.preventDefault()
                handleRightClickCell(rowIndex, columnIndex)
              }}
              key={`${rowIndex}-${columnIndex}`}
            >
              {column}
            </li>
          ))
        )}
      </ul>
      <footer>
        <button
          onClick={() => handleNewGame(0 ? 1 : 2)}
          className="glow-on-hover"
          type="button"
        >
          NEW GAME
        </button>
      </footer>
    </div>
  )
}
