import React from 'react';
import CardType from '../../models/Card';

import './styles.css';
import Card from '../Card';
import take from 'ramda/src/take';
import { reverse } from 'ramda';

const Cemetery: React.SFC<{
  cards: CardType[];
  colorsById: {[id: string]: string}
}> = props => {
  return (
    <div
      className="cemetery-container"
    >
      {take(5, reverse(props.cards)).map(card =>
        <div key={card.id} className={`cemetry--card__container ${card.by ? `cemetry--card__container--${props.colorsById[card.by]}` : ''}`}>
          <Card card={card} />
        </div>
      )}
    </div>
  );
};

export default Cemetery;
