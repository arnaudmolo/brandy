import Card from './Card';

interface Player {
  readonly _id: string;
  readonly name: string;
  readonly color?: string;
  readonly hand: Card[];
  readonly gift: {
    readonly card: Card;
    readonly from: Player;
  }
}

export default Player;
