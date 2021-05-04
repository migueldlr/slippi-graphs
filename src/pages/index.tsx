import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';

import { Data, LoadState } from '../util/types';
import { useDropzone } from 'react-dropzone';
import { fetch_retry } from '../util/util';
import { useRouter } from 'next/router';

export default function Home() {
  const [loadState, setLoadState] = useState<LoadState>(LoadState.IDLE);
  const [origData, setOrigData] = useState<Data | null>(null);

  const [currentFrames, setCurrentFrames] = useState<[number, number]>(null);

  const router = useRouter();

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.NEXT_USE_TEST_GAME != null
    ) {
      console.log(process.env.NODE_ENV);
      (async () => {
        setLoadState(LoadState.LOADING);
        const response = await fetch('/api/game');
        const data: Data = await response.json();
        // console.log(JSON.stringify(data.frames).length);
        for (let key in data) {
          console.log(`${key}: ${JSON.stringify(data[key]).length}`);
        }
        setOrigData(data);
        setCurrentFrames([0, data.stats.lastFrame]);
        console.log(data.stats);
        console.log(data.metadata);
        console.log(data.settings);
        console.log(data.frames[0]);
        console.log(data.inputs);
        setLoadState(LoadState.SUCCESS);
      })();
    }
  }, []);

  // useEffect(() => {

  // }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    (async () => {
      setLoadState(LoadState.LOADING);
      let urlRes;
      try {
        urlRes = await fetch(process.env.NEXT_PUBLIC_AWS_LAMBDA_URL);
      } catch (e) {
        setLoadState(LoadState.ERROR);
        return;
      }

      const { uploadURL } = await urlRes.json();
      await fetch(uploadURL, {
        method: 'PUT',
        body: acceptedFiles[0],
        headers: {
          'Content-Type': '.slp',
        },
      });

      console.log(uploadURL);

      const url = uploadURL
        .split('?')[0]
        .replace('.slp', '.json')
        .replace('melee-vis-data', 'melee-vis-data-parsed');

      const id = url.match(/(\d+)\.json/)[1];
      console.log(id);

      router.push(`/game/${id}`);

      try {
        const res2 = await fetch_retry(5, url);
        const data: Data = await res2.json();
        setOrigData(data);
        setCurrentFrames([0, data.stats.lastFrame]);
        setLoadState(LoadState.SUCCESS);
      } catch (e) {
        setLoadState(LoadState.ERROR);
      }
    })();
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.slp',
    maxFiles: 1,
  });

  const head = (
    <Head>
      <title>Slippi Graphs</title>
    </Head>
  );

  if (loadState === LoadState.IDLE) {
    return (
      <div className="container">
        {head}
        <h1>Slippi Graphs</h1>
        <h3 style={{ fontWeight: 'normal', fontStyle: 'italic', marginTop: 0 }}>
          the Slippi game visualizer you didn't know you didn't need
        </h3>
        <div
          {...getRootProps({ className: 'dropzone' })}
          style={{ backgroundColor: '#EBEBEB', padding: '20px' }}
        >
          <input {...getInputProps()} />
          <p style={{ margin: 0 }}>🐸 Drag a .slp file here 🐸</p>
        </div>
        <div>
          {acceptedFiles.map(file => (
            <p>{file.name}</p>
          ))}
        </div>
        <br />
        <button
          onClick={() => {
            router.push('/game/1');
          }}
        >
          No slippi files? Click here for a demo
        </button>
      </div>
    );
  }

  if (loadState === LoadState.LOADING) {
    return (
      <div className="container">
        {head}
        <p>Loading...</p>
      </div>
    );
  }

  if (loadState === LoadState.ERROR) {
    return (
      <div className="container">
        {head}
        <p>Couldn't process your file 😢</p>
      </div>
    );
  }

  return (
    <div className="container">
      {head}
      <p>Not sure how you got here, but try refreshing 🤔</p>
    </div>
  );
}

export const ususedExport = 'this turns off fast refresh';
