import { Meteor } from 'meteor/meteor';

import { Rooms } from '/imports/api/rooms';
import Players from '/imports/api/players';

Meteor.startup(() => {
  Rooms;
  Players;
  // If the Links collection is empty, add some data.
  // console.log(Rooms, Players);
});
