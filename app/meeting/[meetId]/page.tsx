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
import Image from 'next/image';
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
    return <div className='flex justify-center items-center gap-2 w-full h-full'>
            <Image
                       src={"/icon.svg"}
                       width={1000}
                       height={1000}
                       className="w-9
                        object-cover"
                       alt="logo"
                     />

    </div>
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" className='bg-neutral-900' style={{ height: '100%' }}>
        <MyVideoConference  />
        <RoomAudioRenderer />
        <ControlBar className='border-0 border-neutral-800 bg-neutral-700/15 rounded-2xl' />
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
    <GridLayout tracks={tracks}  className=' rounded-2xl' style={{ height: '90%' }}>
      <ParticipantTile draggable style={{borderRadius:12 }} className=' border-neutral-800/30 rounded-2xl'  />
    </GridLayout>
  );
}