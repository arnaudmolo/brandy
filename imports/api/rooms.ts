import { Mongo } from 'meteor/mongo';
import range from 'ramda/es/range';
import flatten from 'ramda/es/flatten';
import 'meteor/meteor';
import { Meteor } from 'meteor/meteor';
import Players from './players';
import { splitAt, omit } from 'ramda';

function generateUID () {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  let firstPart: number | string = (Math.random() * 46656) | 0;
  let secondPart: number | string = (Math.random() * 46656) | 0;
  firstPart = ('000' + firstPart.toString(36)).slice(-3);
  secondPart = ('000' + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

function shuffleArray (array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const COLORS = ['blue', 'green', 'white', 'yellow', 'red', 'black'];

const generateDeck = () => {
  return ['Hearts', 'Tiles', 'Clovers', 'Pikes'].reduce(
    (deck, family) => [
      ...deck,
      ...range(1, 14).map(value => ({value, family, id: generateUID()})),
    ]
    , [
      {value: 14, family: 'black', id: generateUID()},
      {value: 14, family: 'red', id: generateUID()}
    ]
  );
};

class RoomsCollection extends Mongo.Collection {
  create () {
    return super.insert({
      identifiant: generateUID(),
      deck: shuffleArray([...generateDeck(), ...generateDeck()]),
      cemetery: [],
      pawns: flatten(COLORS.map((color, i) => range(i * 4, (i * 4) + 4).map(index => ({position: 96 + index, color: color})))),
      players: [],
      gifts: [],
    });
  }
  join (roomId: string, playerId: string) {
    console.log('ask to join', roomId, playerId);
    return Meteor.call('rooms.join', roomId, playerId);
  }
  movePawn (roomId: string, from: number, to: number) {
    return Meteor.call('rooms.pawns', roomId, from, to);
  }
  draw (roomId: string, nb: number) {
    return Meteor.call('rooms.draw', roomId, nb);
  }
};

Meteor.methods({
  'rooms.join'(roomId, playerId) {
    const rooms = Rooms.find({players: playerId});
    rooms.map((room) => {
      if (room._id !== roomId) {
        Rooms.update(
          {_id: room._id},
          {
            $pull: {
              players: playerId
            }
          }
        );
      }
    });
    Players.update({_id: playerId}, {$set: {hand: [], color: null, gift: null}});
    Rooms.update({_id: roomId}, {$addToSet: {players: playerId}});
  },
  'rooms.pawns'(roomId, from, to) {
    Rooms.update({_id: roomId}, {
      $set: {
        [`pawns.${from}.position`]: to
      },
    });
  },
  'rooms.draw'(roomId, nb) {
    const room = Rooms.findOne(roomId);
    let deck = room.deck;
    let cemetery = room.cemetery;
    room.players.map((playerId: string) => {
      if (deck.length < +nb) {
        deck = shuffleArray([...deck, ...cemetery.map(omit(['by']))]);
        cemetery = [];
      }
      const [hand, end] = splitAt(nb, deck);
      deck = end;
      return Players.update(playerId, {
        $set: {hand}
      });
    });
    Rooms.update(roomId, {
      $set: {
        gifts: room.players,
        cemetery,
        deck,
      }
    });
  }
});

export const Rooms = new RoomsCollection('rooms');
