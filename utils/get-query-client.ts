import { environmentManager, QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // to avoid refetching immediately on the client
        staleTime: 60 * 1000, 
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (environmentManager.isServer()) {
    // Server: always make a new object per request
    return makeQueryClient()
  } else {
    // Browser: make a new client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}