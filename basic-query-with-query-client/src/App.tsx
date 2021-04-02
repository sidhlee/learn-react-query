import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
  UseQueryResult,
} from 'react-query';
import axios from 'axios';

interface AppProps {}

type Post = {
  id: number;
  title: string;
  body: string;
};

function usePosts() {
  return useQuery(
    'posts', // queryKey
    async (): Promise<Post[]> => {
      const { data } = await axios.get(
        'https://jsonplaceholder.typicode.com/posts',
      );
      return data;
    },
  );
}

interface PostsProp {
  setPostId: React.Dispatch<React.SetStateAction<number>>;
}

const Posts: React.FC<PostsProp> = ({ setPostId }) => {
  const { status, data, error, isFetching } = usePosts();
  return (
    <main>
      <h1>Posts</h1>
      <section>
        {status === 'loading' ? (
          'Loading...'
        ) : error instanceof Error ? (
          <span>Error: {error.message}</span>
        ) : (
          <ul>
            {data?.map((post) => (
              <li key={post.id}>
                <p key={post.id}>
                  <a href="#" onClick={() => setPostId(post.id)}>
                    {post.title}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

async function getPostById(postId: number): Promise<Post> {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );
  // if (Math.random() < 0.5) {
  //   throw new Error('Server error');
  // }
  return data;
}

function usePost(postId: number) {
  return useQuery(['post', postId], () => getPostById(postId), {
    // The query will not execute until the postId exists
    // => don't run query until user clicks on a post.
    enabled: postId > -1,
    // enabled: !!userId // use this when using sting id
  });
}
interface PostProp {
  setPostId: React.Dispatch<React.SetStateAction<number>>;
  postId: number;
}

const Post: React.FC<PostProp> = ({ setPostId, postId }) => {
  // isFetching - In any state, if the query is fetching at any time (including background refetching) isFetching will be true.
  const { status, data, error, isFetching } = usePost(postId);
  return (
    <section>
      <button type="button" onClick={() => setPostId(-1)}>
        Back
      </button>
      {status === 'loading' ? (
        'Loading...'
      ) : error instanceof Error ? (
        // failed query will be retied 3 times until it errors out.
        <span>Error: {error.message}</span>
      ) : (
        <div>
          <h1>{data?.title}</h1>
          <div>
            <p>{data?.body}</p>
          </div>
          <div>{isFetching ? 'Background Updating...' : ''}</div>
        </div>
      )}
    </section>
  );
};

// need to create a new QueryClient instance to pass into QueryClientProvider
const queryClient = new QueryClient();

function App({}: AppProps) {
  const [postId, setPostId] = useState<number>(-1);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {postId > -1 ? (
          <Post setPostId={setPostId} postId={postId} />
        ) : (
          <Posts setPostId={setPostId} />
        )}
      </div>
      ;
    </QueryClientProvider>
  );
}

export default App;
