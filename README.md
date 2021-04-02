# Learn React Query

A place for storing commented code examples & related resources on learning [React Query](https://react-query.tanstack.com/).

## useQuery

```ts
// This is not the actual typing which is 1200% more complicated.
type UseQueryResult = {
  data: any | undefined; // available if isSuccess === true
  error: any | null; // available if isError === true
  isError: boolean; // The query encountered an error
  isIdle: boolean; // The query is currently disabled
  isLoading: boolean; // The query has no data and is currently fetching
  isLoadingError: boolean;
  isRefetchError: boolean;
  isSuccess: boolean; // The query was successful and data is available
  status: 'idle' | 'loading' | 'error' | 'success';
  isFetching: boolean; // true if the query is fetching at any time in any state.
};

const result: UseQueryResult<data, error> = useQuery(queryKey, queryFn);
```
