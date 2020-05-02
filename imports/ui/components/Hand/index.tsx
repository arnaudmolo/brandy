import React, { useCallback, useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import CardType from '../../models/Card';
import Card from '../Card';
import './styles.css';
import Player from '../../models/Player';
import Players from '/imports/api/players';

const Hand: React.SFC<{
  onCardClick?: (card: CardType) => any;
  players: Player[];
  player: Player;
  teamate?: Player;
  hasToGift: boolean;
  onDrawCard?: (card: CardType) => any;
}> = ({onCardClick, players, onDrawCard, hasToGift, player, teamate}) => {
  const [selectedCard, setSelectedCcard] = useState<CardType>(null);

  const onClick = useCallback((card: CardType) => {
    setSelectedCcard(card);
    onCardClick && onCardClick(card);
  }, [onCardClick]);

  const onGiftClick = useCallback(() => {
    if (teamate) {
      Players.gift(player?._id, teamate._id, selectedCard);
      setSelectedCcard();
    }
  }, [player, players, selectedCard, teamate]);

  const onAcceptGift = useCallback(() => {
    if (teamate?.gift && player.gift || !hasToGift) {
      Players.accept();
    }
  }, [teamate?.gift, player.gift, hasToGift]);

  if (!player) {
    return <div>Pas de player</div>
  }
  return (
    <div className={`hand-container ${player.color ? `hand-container--${player.color}` : ''}`}>
      {player.hand.map(card => (
        <div
          key={`${card.value}-${card.family}-${card.id}`}
          className="hand-container__card-container"
        >
          {selectedCard && (card.id === selectedCard.id) && player.color && (
            <ClickAwayListener onClickAway={ () => setSelectedCcard(null)}>
              <div className="hand-container__choice-container">
                {!(teamate?.gift) ? hasToGift ? (
                  <div onClick={onGiftClick} className="choice-container__button__give choice-container__button">
                    <p>Give</p>
                  </div>
                ) : (
                  <div onClick={() => onDrawCard && onDrawCard(selectedCard)} className="choice-container__button__play choice-container__button">
                    <p>Play</p>
                  </div>
                ) : (
                  <div className="choice-container__button__give choice-container__button">
                    <p>Waiting on your teamate</p>
                  </div>
                )}
              </div>
            </ClickAwayListener>
          )}
          <Card card={card} onClick={onClick} />
        </div>
      ))}
      {player.gift && (
        <div className="hand-container__card-container hand-container__card-container__gift">
          <Card onClick={onAcceptGift} hidden card={ player.gift.card } />
        </div>
      )}
    </div>
  );
}

export default Hand;
