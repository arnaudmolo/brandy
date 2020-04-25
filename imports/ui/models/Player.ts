import Card from './Card';

interface Player {
  readonly _id: number;
  readonly name: string;
  readonly color?: string;
  readonly hand: Card[];
  readonly gift: {
    readonly card: Card;
    readonly from: Player;
  }
}

export default Player;
