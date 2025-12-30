'use client';

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


export default function Page() {
  const {roomId} = useParams()
  const [token , settoken] = useState<string>('')
  const {data}  = useSession()

  const name = data?.user?.email;
  const [roomInstance] = useState(() => new Room({
    adaptiveStream: true,
    dynacast: true,
  }));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch(`/api/token?room=${roomId}&username=${name}`);
        const data = await resp.json();
        if (!mounted) return;
        if (data.token) {
          settoken(data.token)
          console.log(token)
          await roomInstance.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL as string, data.token);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  
    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [roomInstance]);

  if (token === '') {
    return <div className='grid grid-cols-4 gap-2 w-full h-full'>
           <div className="bg-neutral-200 w-full h-full"></div>
           <div className="bg-neutral-200 w-full h-full"></div>
           <div className="bg-neutral-200 w-full h-full"></div>
           <div className="bg-neutral-200 w-full h-full"></div>

    </div>;
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" className='bg-neutral-900' style={{ height: '100%' }}>
        <MyVideoConference  />
        <RoomAudioRenderer />
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks}  className=' rounded-2xl' style={{ height: '100dvh' }}>
      <ParticipantTile draggable style={{borderRadius:12 }} className=' border-neutral-800/30 rounded-2xl'  />
    </GridLayout>
  );
}