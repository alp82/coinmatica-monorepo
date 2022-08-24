import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import Test from '../../../shared/Test'

const Home: NextPage = () => {
  const hello = trpc.proxy.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Coinmatica Telegram</title>
        <meta name="description" content="Listen to signals in telegram channels" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>
          Coinmatica <span>Telegram</span> Listener
        </h1>

        <Test />

        <div>
          <h3>This stack uses:</h3>
          <ul>
            <li>
              <a href="https://nextjs.org" target="_blank" rel="noreferrer">
                Next.js
              </a>
            </li>
            <li>
              <a href="https://trpc.io" target="_blank" rel="noreferrer">
                tRPC
              </a>
            </li>
            <li>
              <a
                href="https://typescriptlang.org"
                target="_blank"
                rel="noreferrer"
              >
                TypeScript
              </a>
            </li>
          </ul>

          <div>
            {hello.data ? <p>{hello.data.greeting}</p> : <p>Loading..</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
