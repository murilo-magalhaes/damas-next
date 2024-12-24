export interface IPiece {
  id: number;
  cell_id: number;
  color: string;
  number: number;
  letter: string;
}

export const emptyPiece: IPiece = {
  id: 0,
  cell_id: 0,
  color: '',
  number: 0,
  letter: '',
};
