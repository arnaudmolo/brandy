class Card {
  readonly id: number;
  readonly value: number;
  readonly family: string;
  readonly by?: string;
  constructor () {
    this.id = 0;
    this.value = 0;
    this.family = '';
  }
}

export default Card;
