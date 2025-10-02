// lib/apollo-client.ts

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://200.103.188.216:4000/graphql', 
});

const authLink = setContext((_, { headers }) => {
  // Pega o token de autenticação do localStorage se ele existir
  const token = localStorage.getItem('aura-token');
  // Retorna os headers para o contexto para que o httpLink possa lê-los
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  // Combina o authLink e o httpLink para que cada requisição tenha o token
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;