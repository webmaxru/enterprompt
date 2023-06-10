import { Workbox } from 'workbox-window';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistration(props) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox(process.env.NEXT_PUBLIC_SW_PATH, {
        scope: process.env.NEXT_PUBLIC_SW_SCOPE,
      });

      const refreshPage = () => {
        wb.addEventListener('controlling', (event) => {
          window.location.reload();
        });

        wb.messageSkipWaiting();
      };

      const Msg = () => (
        <div>
          Updated app is available&nbsp;&nbsp;
          <button onClick={refreshPage}>Reload</button>
        </div>
      );

      const showSkipWaitingPrompt = (event) => {
        //toast.info(<Msg />);
      };

      wb.addEventListener('waiting', showSkipWaitingPrompt);

      wb.addEventListener('message', (event) => {
        if (!event.data) {
          return;
        }
        if (event.data.type === 'REPLAY_COMPLETED') {
          toast.success(
            'Your API call was sent after the connection is restored'
          );
        }
        if (event.data.type === 'REQUEST_FAILED') {
          toast.warning(
            'Your API call will be sent after the connection is restored'
          );
        }
      });

      wb.register()
        .then((swRegistration) => {})
        .catch((error) => {
          console.error('[App] Service worker register error', error);
        });
    } else {
      console.error('[App] Service workers are not supported in this browser');
    }
  }, []);

  return null;
}
