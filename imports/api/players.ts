import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import Card from '../ui/models/Card';
import { Rooms } from './rooms';

class PlayersCollection extends Mongo.Collection {
  changeName (playerId: string, name: string) {
    super.update(playerId, {$set: { name }});
  }
  createOrFind = () => {
    let player = localStorage.getItem('player');
    Session.set('player', player);
    if (player) {
      return super.findOne({_id: player});
    }
    player = super.insert({
      name: 'user-' + Math.abs(Math.floor(Math.random() * 10000)),
      hand: [],
    });
    if (!player) {
      throw new Error('No player created');
    }
    localStorage.setItem('player', player);
    Session.set('player', player);
    return super.findOne({_id: player});
  }
  gift (playerId: string, teamateId: string, card: Card) {
    Meteor.call('players.gift', playerId, teamateId, card);
  }
  discard () {
    Meteor.call('players.discard', Session.get('player'));
  }
  accept () {
    Meteor.call('players.accept', Session.get('player'));
  }
  play (card: Card) {
    Meteor.call('players.play', Session.get('player'), card);
  }
}

const Players = new PlayersCollection('players');

export default Players;

Meteor.methods({
  'players.play'(playerId: string, card) {
    Players.update({_id: playerId}, {
      $pull: {
        hand: card
      },
    });
    Rooms.update({players: playerId}, {$addToSet: {cemetery: {...card, by: playerId}}});
  },
  'players.gift'(playerId: string, teamateId: string, card: Card) {
    Players.update({_id: teamateId}, {
      $set: {
        gift: {
          from: playerId,
          card: card
        }
      }
    });
    Players.update({_id: playerId}, {
      $pull: {
        hand: card
      }
    });
    Rooms.update({players: playerId}, {$pull: {gifts: playerId}});
  },
  'players.accept'(playerId) {
    const player = Players.findOne(playerId);
    Players.update(player._id, {
      $unset: {
        gift: null,
      },
      $addToSet: {
        hand: player.gift.card
      }
    });
  },
  'players.discard'(playerId) {
    const player = Players.findOne(playerId);
    const teamate = Players.findOne({_id: player.gift.from});
    Players.update(teamate, {
      $push: {
        hand: player.gift.card,
      }
    });
    Players.update(player, {
      $unset: {
        gift: null,
      },
    });
  }
});
