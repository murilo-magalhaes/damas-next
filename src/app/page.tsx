'use client';

import { useEffect, useState } from 'react';
import { emptyCell, ICell } from './dtos/ICellDTO';
import { emptyPiece, IPiece } from './dtos/IPieceDTO';
import { EColor } from '@/enum/EnumColor';

export default function Home() {
  const [cells, setCells] = useState<ICell[]>([]);

  const [piece, setPiece] = useState<IPiece>(emptyPiece);
  const [pieces, setPieces] = useState<IPiece[]>([]);

  const [videoReady, setVideoReady] = useState(false);

  const [turn, setTurn] = useState<EColor>(EColor.LIGHT);

  useEffect(() => {
    mountBoard();
  }, []);

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
    const _cells: ICell[] = [];
    const _pieces: IPiece[] = [];

    for (let i = 8; i >= 1; i--) {
      for (let j = 1; j <= 8; j++) {

        const cell = {
          ...emptyCell,
          id: _cells.length + 1,
          letter: numberToLetter(j),
          number: i,
          title: numberToLetter(j) + i.toString(),
        };
        cell.color = isDarkCell(cell) ? EColor.DARK : EColor.LIGHT;

        if ((cell.number >= 6 || cell.number <= 3) && cell.color === EColor.DARK) {
          const piece = {
            id: _pieces.length + 1,
            cell_id: cell.id,
            color: cell.number >= 6 ? 'dark' : 'light',
            letter: cell.letter,
            number: cell.number,
          };
          _pieces.push(piece);

          cell.piece_id = piece.id;
        }

        _cells.push(cell);
      }
    }

    setPieces(_pieces);
    setCells(_cells);
  };

  const isDarkCell = (cell: ICell): boolean => {
    return (
      (cell.number % 2 === 0 && letterToNumber(cell.letter) % 2 === 0) ||
      (cell.number % 2 !== 0 && letterToNumber(cell.letter) % 2 !== 0)
    );
  };

  const renderPiece = (cell: ICell) => {
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

  const switchTurn = () => {
    setTurn(prev => prev === EColor.LIGHT ? EColor.DARK : EColor.LIGHT);
  }

  const handleClickPiece = (piece: IPiece) => {
    if(turn !== piece.color) return;
    setPiece(piece);

    const cell = cells.find(c => c.id === piece.cell_id);
    if (cell) {

      let freeCellsAhead = [];
      if (piece.color === 'light') {
        freeCellsAhead = cells.filter(
          c =>
            c.color === EColor.DARK &&
            c.piece_id === 0 &&
            (c.id === cell.id - 9 || c.id === cell.id - 7),
        );
      } else {
        freeCellsAhead = cells.filter(
          c =>
            c.color === EColor.DARK &&
            c.piece_id === 0 &&
            (c.id === cell.id + 9 || c.id === cell.id + 7),
        );
      }

      setCells(prev => prev.map(c => ({
        ...c,
        highlighted: freeCellsAhead.length !== 0 && c.id === cell.id || freeCellsAhead.some(_c => _c.id === c.id),
      })));
    }
  };

  const hasAvailableMove = (cell: ICell): boolean => {
    if (cell.piece_id === 0) return false;
    const piece = pieces.find(p => p.id === cell.piece_id);
    if(piece) {
      if(turn === EColor.LIGHT && piece.color === EColor.LIGHT && cells.filter(
        c =>
          c.color === EColor.DARK &&
          c.piece_id === 0 &&
          (c.id === cell.id - 9 || c.id === cell.id - 7),
      ).length > 0) return true;

      if(turn === EColor.DARK && piece.color === EColor.DARK && cells.filter(
        c =>
          c.color === EColor.DARK &&
          c.piece_id === 0 &&
          (c.id === cell.id + 9 || c.id === cell.id + 7),
      ).length > 0) return true;
    }
    return false;
  }

  const unHighlightedAllCells = () => {
    setCells(prev => prev.map(cell => ({ ...cell, highlighted: false })));
    // return cells.map(cell => ({...cell, highlighted: false}))
  };

  const handleClickCell = (cell: ICell) => {
    console.log('Célula clicada', cell.letter, cell.number);
    if (cell.highlighted && piece.cell_id !== cell.id) {
      console.log('Mover peça');
      const oldCellId = piece.cell_id;
      const pieceMoved = {
        ...piece,
        cell_id: cell.id,
        letter: cell.letter,
        number: cell.number,
      };
      setPieces(prev => prev.map(p => p.id === pieceMoved.id ? pieceMoved : p));
      setPiece(emptyPiece);

      setCells(prev => prev
        .map(c =>
          c.id === cell.id
            ? { ...c, piece_id: pieceMoved.id, highlighted: false }
            : c.id === oldCellId
              ? { ...c, piece_id: 0, highlighted: false }
              : {...c, highlighted: false }));

      switchTurn()
    }
  };

  return (
    <main>
      <h1 className="w-full text-center pt-8">Damas</h1>

      <div className="container d-flex justify-content-center align-items-center">
        <div className={`board ${turn === EColor.DARK ? 'rotated' : ''}`}>
          {cells
            .sort((a, b) => a.id - b.id)
            .map(c => (
              <div
                className={`cell ${c.color} ${
                  c.highlighted ? 'cell-highlight' : ''
                } ${hasAvailableMove(c) ? 'has-available-move' : ''}`}
                key={c.id}
                id={`cell-${c.id}`}
                onClick={() => handleClickCell(c)}
              >
                {renderPiece(c)}
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
