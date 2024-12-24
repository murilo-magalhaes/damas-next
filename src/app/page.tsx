'use client';

import { useEffect, useState } from 'react';
import { ICell } from './dtos/ICellDTO';
import { IPiece } from './dtos/IPieceDTO';

export default function Home() {
  const [cells, setCells] = useState<ICell[]>([]);
  const [pieces, setPieces] = useState<IPiece[]>([]);
  const [videoReady, setVideoReady] = useState(false);

  const [turn, setTurn] = useState<string>('light');

  useEffect(() => {
    mountBoard();
  }, []);

  useEffect(() => {
    mountPieces();
  }, [cells]);

  // Adicionando controle de vídeo
  const handleVideoClick = () => {
    const iframe = document.getElementById(
      'youtube-video',
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.src += '&autoplay=1';
      iframe.src = iframe.src.replace('mute=1', ''); // Remover o mute
      setVideoReady(true);
    }
  };

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

    let index = 0;
    cells.forEach(c => {
      if ((c.number >= 6 || c.number <= 3) && isDarkCell(c)) {
        index++;
        pieces.push({
          id: index,
          cell_id: c.id,
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

    if (piece) {
      return (
        <div
          className={`piece piece-${piece.color}`}
          id={`piece-${piece.id}`}
          onClick={() => handleClickPiece(piece)}
        ></div>
      );
    }
    return null;
  };

  const handleClickPiece = (piece: IPiece) => {
    let hasHighlighted = false;

    pieces.forEach(p => {
      const cell = cells.find(c => c.id === p.cell_id);
      if (p.id !== piece.id && cell?.highlighted) {
        hasHighlighted = true;
        return;
      }
    });

    if (!hasHighlighted) {
      const cell = cells.find(c => c.id === piece.cell_id);

      if (cell) {
        let _cells = cells.filter(c => c.id !== piece.cell_id);
        cell.highlighted = !cell.highlighted;

        _cells.push(cell);

        let cellsAhead = [];
        if (piece.color === 'light') {
          cellsAhead = cells.filter(
            c => c.id === cell.id - 9 || c.id === cell.id - 7,
          );
        } else {
          cellsAhead = cells.filter(
            c => c.id === cell.id + 9 || c.id === cell.id + 7,
          );
        }

        _cells = _cells.filter(c => !cellsAhead.find(cell => c.id === cell.id));

        cellsAhead.forEach(c => {
          c.highlighted = !c.highlighted;
          _cells.push(c);
        });

        setCells(_cells);
      }
    }
  };

  return (
    <main>
      <h1 className="w-full text-center pt-8">Damas</h1>

      <div className="container d-flex justify-content-center align-items-center">
        <div className="board">
          {cells
            .sort((a, b) => a.id - b.id)
            .map(c => (
              <div
                className={`cell ${isDarkCell(c) ? 'dark' : 'light'} ${
                  c.highlighted ? 'cell-highlight' : ''
                }`}
                key={c.id}
                id={`cell-${c.id}`}
              >
                {putPiece(c)}
              </div>
            ))}
        </div>
      </div>

      {/* Botão para iniciar o autoplay com som */}
      {!videoReady && (
        <button onClick={handleVideoClick} className="start-video-button">
          Reproduzir vídeo
        </button>
      )}

      <iframe
        id="youtube-video"
        width="560"
        height="315"
        src="https://www.youtube.com/embed/jfKfPfyJRdk?si=u4ncY1uFbm0fdO_d&mute=1"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        style={{ display: 'none' }} // Esconde o iframe até o click
        allowFullScreen
      ></iframe>
    </main>
  );
}
