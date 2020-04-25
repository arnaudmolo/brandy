import React, { useState, useCallback } from 'react';
import { take } from 'ramda';
import CardType from '../../models/Card';

import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

import Card from '../Card';
import './styles.css';

const Drawer: React.SFC<{
  onDraw?: (nbCards: number) => any
}> = ({onDraw}) => {
  const [nbCards, setNbCards] = useState(6);
  const onClick = useCallback(() => {
    onDraw && onDraw(nbCards);
  }, [onDraw, nbCards]);

  const onChange = useCallback((event) => {
    setNbCards(event.target.value);
  }, []);

  return (
    <FormControl>
      <Input
        type="number"
        value={ nbCards }
        onChange={ onChange }
        inputProps={{
          'aria-label': 'weight',
          min: 1,
          max: 6
        }}
      />
      <FormHelperText id="standard-weight-helper-text">Cards</FormHelperText>
      <Button onClick={ onClick } size="small" variant="outlined">Default</Button>
    </FormControl>
  );
};

const Deck: React.SFC<{
  cards: CardType[];
  onDraw?: (nbCards: number) => any
  visible?: boolean;
}> = ({cards, onDraw, visible}) => {
  return (
    <div>
      <p>il y à { cards.length } cartes</p>
      <Drawer onDraw={onDraw} />
      {visible && <ul className="deck--deck__container">
        {
          take(5, cards).map((card) =>
            <li
              key={`${card.family}-${card.value}`}
              className="deck--card__container"
            >
              <Card card={card} hidden />
            </li>
          )
        }
      </ul>}
    </div>
  );
};

export default React.memo(Deck);
