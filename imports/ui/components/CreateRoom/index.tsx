import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Rooms } from '../../../api/rooms';
import { useTracker } from 'meteor/react-meteor-data';

const CreateRoom: React.SFC<{}> = () => {
  const history = useHistory();
  const [roomId, setroomId] = useState(null);
  
  const room = useTracker(() => Rooms.findOne({_id: roomId}));

  useEffect(() => {
    if (room) {
      history.push(`/room/${room.identifiant}`);
    }
  }, [room]);
  const onClick = React.useCallback(async () => {
    try {
      setroomId(Rooms.create());
    } catch (error) {
      console.error(error);
    }
  }, []);
  return (
    <div>
      <button onClick={ onClick }>Create a room</button>
    </div>
  );
};

export default CreateRoom;
