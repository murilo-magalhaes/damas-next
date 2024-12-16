'use client';

import { useEffect, useState } from 'react';
import { ICell } from './dtos/ICellDTO';
import { IPiece } from './dtos/IPieceDTO';

export default function Home() {
  const [cells, setCells] = useState<ICell[]>([]);
  const [pieces, setPieces] = useState<IPiece[]>([]);

  useEffect(() => {
    mountBoard();
  }, []);

  useEffect(() => {
    mountPieces();
  }, [cells]);

  const numberToLetter = (num: number) => {
    if (num < 1 || num > 26) {
      throw new Error('Número fora do intervalo (1-26)');
    }
    return String.fromCharCode(64 + num);
  };

  const letterToNumber = (letter: string) => {
    const upperCaseLetter = letter.toUpperCase(); // Garante que seja maiúscula
    const code = upperCaseLetter.charCodeAt(0);

    if (code < 65 || code > 90) {
      throw new Error('Caractere fora do intervalo A-Z');
    }

    return code - 64;
  };

  const mountBoard = () => {
    const cells: ICell[] = [];

    let index = 0;
    for (let i = 8; i >= 1; i--) {
      for (let j = 1; j <= 8; j++) {
        index++;
        cells.push({
          id: index,
          letter: numberToLetter(j),
          number: i,
          title: numberToLetter(j) + i.toString(),
          highlighted: false,
        });
      }
    }

    setCells(cells);
  };

  const mountPieces = () => {
    const pieces: IPiece[] = [];

    cells.forEach((c, i) => {
      if ((c.number >= 6 || c.number <= 3) && isDarkCell(c)) {
        pieces.push({
          id: i,
          color: c.number >= 6 ? 'dark' : 'light',
          letter: c.letter,
          number: c.number,
        });
      }
    });

    setPieces(pieces);
  };

  const isDarkCell = (cell: ICell): boolean => {
    return (
      (cell.number % 2 === 0 && letterToNumber(cell.letter) % 2 === 0) ||
      (cell.number % 2 !== 0 && letterToNumber(cell.letter) % 2 !== 0)
    );
  };

  const putPiece = (cell: ICell) => {
    const piece = pieces.find(
      p => p.letter === cell.letter && p.number === cell.number,
    );

    if (piece)
      return (
        <div
          className={`piece ${piece.color}`}
          id={piece.id.toString()}
          onClick={() => handleClickPiece(piece)}
        >
          .
        </div>
      );
  };

  const handleClickPiece = (piece: IPiece) => {
    
  };

  return (
    <main>
      <h1 className="w-full text-center">Damas</h1>

      <div className="board">
        {cells.map(c => (
          <div
            className={`cell ${isDarkCell(c) ? 'dark' : 'light'} ${
              c.highlighted ? 'highlighted' : ''
            }`}
            key={c.id}
          >
            {putPiece(c)}
          </div>
        ))}
      </div>
    </main>
  );
}
