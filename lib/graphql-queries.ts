import { gql } from '@apollo/client';

// Queries
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    userByEmail(email: $email) {
      id
      name
      email
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

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

export const GET_BANK = gql`
  query GetBank($id: ID!) {
    bank(id: $id) {
      id
      name
      createdAt
      updatedAt
      userId
    }
  }
`;

export const GET_BANK_ACCOUNTS = gql`
  query GetBankAccounts($bankId: ID!) {
    bankAccounts(bankId: $bankId) {
      id
      createdAt
      updatedAt
      userId
      bankId
      accountId
      type
      balance
      currencyCode
    }
  }
`;

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

// Mutations
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        phoneNumber
        createdAt
        updatedAt
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        phoneNumber
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const CREATE_BANK = gql`
  mutation CreateBank($input: CreateBankInput!) {
    createBank(input: $input) {
      id
      name
      createdAt
      updatedAt
      userId
    }
  }
`;

export const UPDATE_BANK = gql`
  mutation UpdateBank($id: ID!, $input: UpdateBankInput!) {
    updateBank(id: $id, input: $input) {
      id
      name
      createdAt
      updatedAt
      userId
    }
  }
`;

export const DELETE_BANK = gql`
  mutation DeleteBank($id: ID!) {
    deleteBank(id: $id)
  }
`;

export const CREATE_BANK_ACCOUNT = gql`
  mutation CreateBankAccount($input: CreateBankAccountInput!) {
    createBankAccount(input: $input) {
      id
      createdAt
      updatedAt
      userId
      bankId
      accountId
      type
      balance
      currencyCode
    }
  }
`;

export const UPDATE_BANK_ACCOUNT = gql`
  mutation UpdateBankAccount($id: ID!, $input: UpdateBankAccountInput!) {
    updateBankAccount(id: $id, input: $input) {
      id
      createdAt
      updatedAt
      userId
      bankId
      accountId
      type
      balance
      currencyCode
    }
  }
`;

export const DELETE_BANK_ACCOUNT = gql`
  mutation DeleteBankAccount($id: ID!) {
    deleteBankAccount(id: $id)
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
