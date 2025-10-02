// Tipos baseados no schema GraphQL

export interface UserType {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankType {
  id: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface BankAccountType {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  bankId: string;
  accountId?: string;
  type?: string;
  balance?: number;
  currencyCode?: string;
}

export interface TransactionType {
  id: string;
  createdAt: string;
  updatedAt: string;
  bankId: string;
  type?: string;
  amount?: number;
  currency?: string;
  description?: string;
  transactionDate?: string;
}

// Inputs para mutations
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

export interface CreateBankInput {
  name: string;
  userId: string;
}

export interface CreateBankAccountInput {
  bankId: string;
  accountId?: string;
  type?: string;
  balance?: number;
  currencyCode?: string;
}

export interface UpdateBankInput {
  name?: string;
}

export interface UpdateBankAccountInput {
  accountId?: string;
  type?: string;
  balance?: number;
  currencyCode?: string;
}

export interface CreateTransactionInput {
  bankId: string;
  type?: string;
  amount?: number;
  currency?: string;
  description?: string;
  transactionDate?: string;
}

export interface UpdateTransactionInput {
  type?: string;
  amount?: number;
  currency?: string;
  description?: string;
  transactionDate?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Response types
export interface AuthResponse {
  token: string;
  user: UserType;
}

export interface LoginResponse {
  token: string;
  user: UserType;
}
