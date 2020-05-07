import React, { useState, useCallback } from 'react';
import CardType from '../../models/Card';

import './styles.css';
import Card from '../Card';
import take from 'ramda/src/take';
import { reverse } from 'ramda';
import { ClickAwayListener } from '@material-ui/core';

const Cemetery: React.SFC<{
  cards: CardType[];
  colorsById: {[id: string]: string}
}> = props => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <ClickAwayListener onClickAway={useCallback(() => setVisible(false), [])}>
      <div
        onClick={useCallback(() => setVisible(state => !state), [])}
        className={`cemetery-container ${visible ? 'cemetery-container--visible' : ''}`}
      >
        {take(5, reverse(props.cards)).map(card =>
          <div key={card.id} className={`cemetry--card__container ${card.by ? `cemetry--card__container--${props.colorsById[card.by]}` : ''}`}>
            <Card card={card} />
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default Cemetery;
