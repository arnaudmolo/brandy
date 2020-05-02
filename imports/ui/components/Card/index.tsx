import React, { useCallback } from 'react';
import CardType from '../../models/Card';
import './styles.css';
import back from './dos.png';
import all from './preview.png';
import Popup from 'reactjs-popup';

type Props = {
  card: CardType;
  hidden?: boolean;
  onClick?: (card: CardType) => any;
}

const families = ['Pikes', 'Hearts', 'Clovers', 'Tiles', 'black', 'red'];

const noobs = [
  `Avance de 1
  Avance de 11
  Sors un pion`,
  `Avance de 2`,
  `Avance de 3`,
  `Avance de 4
  ou recule de 4 !!!
  `,
  `Avance de 5`,
  `Avance de 6`,
  `Avance les points que tu veux de 7 au total`,
  `Avance de 8`,
  `Avance de 9`,
  `Avance de 10`,
  `Echange ton pion avec un pion ayant déjà bougé`,
  `Avance de 12`,
  `Sors un pion
  ou
  Avance de 13`,
  `Ta carte prend la valeur de toute autre carte`
];

export default ({onClick, card, hidden}: Props) => {
  const onCardClick = useCallback(() => onClick && onClick(card), [onClick, card]);
  if (hidden) {
    return (
      <div className="card hidden-card" onClick={onCardClick}>
        <img className="hidden-card__img" alt="Back of a card" src={back} />
      </div>
    );
  } else {

    let x = 35 + (card.value - 1) * 191.5;
    let y = 35 + families.indexOf(card.family) * 262;

    if (card.family === 'red') {
      x = 225;
      y = 1090;
    } else if (card.family === 'black') {
      x = 35;
      y = 1090;
    }

    return (
      <Popup
        on='hover'
        position='top center'
        trigger={
          <div
            style={{backgroundPosition: `-${x}px -${y}px`, backgroundImage: `url(${all})`}}
            className={`card visible-card card__${card.family} `}
            onClick={onCardClick}
          />
        }
      >
        <p>{noobs[card.value - 1]}</p>
      </Popup>
    );
  }
};

console.log(back
  , all
  );