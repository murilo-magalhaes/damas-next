export interface ICell {
  id: number;
  title: string;
  number: number;
  letter: string;
  highlighted: boolean;
}

export const emptyCell: ICell = {
  id: 0,
  title: '',
  number: 0,
  letter: '',
  highlighted: false,
};
