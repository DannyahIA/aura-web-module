import { TransactionType } from './types';

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface EnhancedTransaction extends TransactionType {
  status: TransactionStatus;
  bankName?: string;
}

export const mockTransactions: EnhancedTransaction[] = [
  {
    id: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bankId: 'chase-1',
    type: 'Payment',
    amount: 2500,
    currency: 'USD',
    description: 'Payment from Acme Corp',
    transactionDate: '2025-02-09T00:00:00Z',
    status: 'Completed',
    bankName: 'Chase'
  },
  {
    id: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bankId: 'bofa-1',
    type: 'Transfer',
    amount: -500,
    currency: 'USD',
    description: 'Transfer to Savings Account',
    transactionDate: '2025-02-08T00:00:00Z',
    status: 'Completed',
    bankName: 'Bank of America'
  },
  {
    id: '3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bankId: 'chase-1',
    type: 'Payment',
    amount: -99.99,
    currency: 'USD',
    description: 'Subscription - Cloud Services',
    transactionDate: '2025-02-07T00:00:00Z',
    status: 'Completed',
    bankName: 'Chase'
  },
  {
    id: '4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bankId: 'wells-1',
    type: 'Refund',
    amount: 149.99,
    currency: 'USD',
    description: 'Refund - Order #4521',
    transactionDate: '2025-02-06T00:00:00Z',
    status: 'Completed',
    bankName: 'Wells Fargo'
  },
  {
    id: '5',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bankId: 'chase-1',
    type: 'Payment',
    amount: -15,
    currency: 'USD',
    description: 'Payment Processing Fee',
    transactionDate: '2025-02-06T00:00:00Z',
    status: 'Completed',
    bankName: 'Chase'
  },
  {
    id: '6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bankId: 'bofa-1',
    type: 'Deposit',
    amount: 5000,
    currency: 'USD',
    description: 'Wire Transfer - Client Payment',
    transactionDate: '2025-02-05T00:00:00Z',
    status: 'Pending',
    bankName: 'Bank of America'
  },
  {
    id: '7',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bankId: 'wells-1',
    type: 'Payment',
    amount: -49,
    currency: 'USD',
    description: 'Monthly Platform Fee',
    transactionDate: '2025-02-04T00:00:00Z',
    status: 'Completed',
    bankName: 'Wells Fargo'
  },
  {
    id: '8',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bankId: 'chase-1',
    type: 'Payment',
    amount: 1750,
    currency: 'USD',
    description: 'Payment from Beta LLC',
    transactionDate: '2025-02-03T00:00:00Z',
    status: 'Completed',
    bankName: 'Chase'
  },
];

export const getTransactionTypeOptions = () => [
  { label: 'Payment', value: 'Payment' },
  { label: 'Transfer', value: 'Transfer' },
  { label: 'Deposit', value: 'Deposit' },
  { label: 'Withdrawal', value: 'Withdrawal' },
  { label: 'Refund', value: 'Refund' },
  { label: 'Fee', value: 'Fee' },
];

export const getTransactionStatusOptions = () => [
  { label: 'Completed', value: 'Completed' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
];

export const getBankOptions = () => [
  { label: 'Chase', value: 'chase-1' },
  { label: 'Bank of America', value: 'bofa-1' },
  { label: 'Wells Fargo', value: 'wells-1' },
];

export const formatCurrency = (amount: number | undefined, currency = 'USD') => {
  if (amount === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatShortDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};
