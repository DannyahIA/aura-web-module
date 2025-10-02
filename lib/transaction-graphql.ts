import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      id
      createdAt
      updatedAt
      bankId
      type
      amount
      currency
      description
      transactionDate
    }
  }
`;

export const GET_TRANSACTIONS_BY_USER_ID = gql`
  query GetTransactionsByUserId($userId: ID!) {
    transactionsByUserId(userId: $userId) {
      id
      createdAt
      updatedAt
      bankId
      type
      amount
      currency
      description
      transactionDate
    }
  }
`;

export const GET_TRANSACTIONS_BY_BANK_ID = gql`
  query GetTransactionsByBankId($bankId: ID!) {
    transactionsByBankId(bankId: $bankId) {
      id
      createdAt
      updatedAt
      bankId
      type
      amount
      currency
      description
      transactionDate
    }
  }
`;

export const GET_TRANSACTIONS_BY_DATE_RANGE = gql`
  query GetTransactionsByDateRange($startDate: DateTimeISO!, $endDate: DateTimeISO!) {
    transactionsByDateRange(startDate: $startDate, endDate: $endDate) {
      id
      createdAt
      updatedAt
      bankId
      type
      amount
      currency
      description
      transactionDate
    }
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!) {
    transaction(id: $id) {
      id
      createdAt
      updatedAt
      bankId
      type
      amount
      currency
      description
      transactionDate
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      createdAt
      updatedAt
      bankId
      type
      amount
      currency
      description
      transactionDate
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
      createdAt
      updatedAt
      bankId
      type
      amount
      currency
      description
      transactionDate
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

// Also need banks to display bank names
export const GET_BANKS = gql`
  query GetBanks {
    banks {
      id
      name
      createdAt
      updatedAt
      userId
    }
  }
`;

export const GET_BANKS_BY_USER_ID = gql`
  query GetBanksByUserId($userId: ID!) {
    banksByUserId(userId: $userId) {
      id
      name
      createdAt
      updatedAt
      userId
    }
  }
`;
