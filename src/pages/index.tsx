import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';

import { LoadState } from '../util/types';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/router';
import Spinner from '../components/Spinner';
import Link from 'next/link';

export default function Home() {
  const [loadState, setLoadState] = useState<LoadState>(LoadState.IDLE);

  const router = useRouter();

  useEffect(() => {
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.NEXT_DEV_DEFAULT_GAME != null
    ) {
      router.push('/game/1');
    }
  }, []);

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

      // console.log(uploadURL);

      const url = uploadURL
        .split('?')[0]
        .replace('.slp', '.json')
        .replace('melee-vis-data', 'melee-vis-data-parsed');

      const id = url.match(/(\d+)\.json/)[1];
      // console.log(id);

      router.push(`/game/${id}`);
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
        <br />
        <Link href="/about">About</Link>
      </div>
    );
  }

  if (loadState === LoadState.LOADING) {
    return (
      <div className="container">
        {head}
        <Spinner />
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
