import { EColor } from '@/enum/EnumColor';

export interface ICell {
  id: number;
  title: string;
  number: number;
  letter: string;
  highlighted: boolean;
  color: EColor;
  piece_id: number;
}

export const emptyCell: ICell = {
  id: 0,
  piece_id: 0,
  title: '',
  number: 0,
  letter: '',
  highlighted: false,
  color: EColor.DARK,
};
