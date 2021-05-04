import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

interface Props {}

const AboutPage = (props: Props) => {
  return (
    <div className="container">
      <Head>
        <title>About - Slippi Graphs</title>
      </Head>
      <h2>About</h2>
      <p>
        Slippi Graphs was written by{' '}
        <a href="https://github.com/migueldlr">migueldlr</a> for a course
        project using <a href="https://nextjs.org/">Next.js</a> and{' '}
        <a href="https://d3js.org/">D3</a>.
      </p>
      <p>
        Character/controller assets from{' '}
        <a href="https://github.com/bkacjios/m-overlay">M'Overlay</a>
      </p>
      <p>
        Data parsing using{' '}
        <a href="https://github.com/project-slippi/slippi-js">slippi-js</a>.
      </p>
      <p>
        Game IDs from{' '}
        <a href="https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md">
          the Slippi Wiki
        </a>
      </p>
      <p>
        Not affiliated with <a href="http://slippi.gg/">Slippi</a> - please
        support the amazing work they do!
      </p>
      <p>
        <Link href="/">Home</Link>
      </p>
    </div>
  );
};

export default AboutPage;
