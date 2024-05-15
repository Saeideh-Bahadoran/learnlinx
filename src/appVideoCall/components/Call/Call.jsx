import React, { useState, useCallback } from 'react';
import {
  useParticipantIds,
  useScreenShare,
  useDailyEvent,
  useLocalSessionId,
} from '@daily-co/daily-react';

import './Call.css';
import Tile from '../Tile/Tile';
import UserMediaError from '../UserMediaError/UserMediaError';

export default function Call() {
  const [getUserMediaError, setGetUserMediaError] = useState(false);

  useDailyEvent(
    'camera-error',
    useCallback(() => {
      setGetUserMediaError(true);
    }, []),
  );

  const { screens } = useScreenShare();
  const remoteParticipantIds = useParticipantIds({ filter: 'remote' });

  const localSessionId = useLocalSessionId();
  const isAlone = remoteParticipantIds.length < 1 || screens.length < 1;

  const renderCallScreen = () => (
    <div className={screens.length > 0 ? 'is-screenshare' : 'call'}>
      {localSessionId && <Tile id={localSessionId} isLocal isAlone={isAlone} />}

      {remoteParticipantIds.length > 0 || screens.length > 0 ? (
        <>
          {remoteParticipantIds.map((id) => (
            <Tile key={id} id={id} />
          ))}
          {screens.map((screen) => (
            <Tile key={screen.screenId} id={screen.session_id} isScreenShare />
          ))}
        </>
      ) : (
        <div className="info-box">
          <h1>Waiting for others</h1>
          <p>Invite someone by sharing this link:</p>
          <span className="room-url">{window.location.href}</span>
        </div>
      )}
    </div>
  );

  return getUserMediaError ? <UserMediaError /> : renderCallScreen();
}
