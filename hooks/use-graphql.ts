import { useEffect, useState } from 'react';
import client from '@/lib/apollo-client';
import { 
  GET_BANKS_BY_USER_ID, 
  GET_TRANSACTIONS_BY_USER_ID, 
  GET_BANK_ACCOUNTS,
  CREATE_BANK,
  CREATE_TRANSACTION,
  CREATE_BANK_ACCOUNT,
  UPDATE_BANK,
  DELETE_BANK
} from '@/lib/graphql-queries';
import { BankType, TransactionType, BankAccountType, CreateBankInput, CreateTransactionInput, CreateBankAccountInput } from '@/lib/types';

// Hook para gerenciar bancos
export function useBanks(userId?: string) {
  const [banks, setBanks] = useState<BankType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBanks = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await client.query({
        query: GET_BANKS_BY_USER_ID,
        variables: { userId },
        fetchPolicy: 'network-only'
      });
      
      setBanks((data as any)?.banksByUserId || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar bancos');
      console.error('Error fetching banks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBank = async (input: CreateBankInput) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_BANK,
        variables: { input },
        refetchQueries: [{ query: GET_BANKS_BY_USER_ID, variables: { userId } }]
      });
      
      return (data as any)?.createBank;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao criar banco');
    }
  };

  const updateBank = async (id: string, input: { name?: string }) => {
    try {
      const { data } = await client.mutate({
        mutation: UPDATE_BANK,
        variables: { id, input },
        refetchQueries: [{ query: GET_BANKS_BY_USER_ID, variables: { userId } }]
      });
      
      return (data as any)?.updateBank;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar banco');
    }
  };

  const deleteBank = async (id: string) => {
    try {
      await client.mutate({
        mutation: DELETE_BANK,
        variables: { id },
        refetchQueries: [{ query: GET_BANKS_BY_USER_ID, variables: { userId } }]
      });
      
      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao deletar banco');
    }
  };

  useEffect(() => {
    fetchBanks();
  }, [userId]);

  return {
    banks,
    loading,
    error,
    refetch: fetchBanks,
    createBank,
    updateBank,
    deleteBank
  };
}

// Hook para gerenciar transações
export function useTransactions(userId?: string) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await client.query({
        query: GET_TRANSACTIONS_BY_USER_ID,
        variables: { userId },
        fetchPolicy: 'network-only'
      });
      
      setTransactions((data as any)?.transactionsByUserId || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar transações');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (input: CreateTransactionInput) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_TRANSACTION,
        variables: { input },
        refetchQueries: [{ query: GET_TRANSACTIONS_BY_USER_ID, variables: { userId } }]
      });
      
      return (data as any)?.createTransaction;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao criar transação');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction
  };
}

// Hook para gerenciar contas bancárias
export function useBankAccounts(bankId?: string) {
  const [accounts, setAccounts] = useState<BankAccountType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    if (!bankId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await client.query({
        query: GET_BANK_ACCOUNTS,
        variables: { bankId },
        fetchPolicy: 'network-only'
      });
      
      setAccounts((data as any)?.bankAccounts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contas');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBankAccount = async (input: CreateBankAccountInput) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_BANK_ACCOUNT,
        variables: { input },
        refetchQueries: [{ query: GET_BANK_ACCOUNTS, variables: { bankId } }]
      });
      
      return (data as any)?.createBankAccount;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao criar conta bancária');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [bankId]);

  return {
    accounts,
    loading,
    error,
    refetch: fetchAccounts,
    createBankAccount
  };
}

// Hook genérico para fazer queries GraphQL
export function useGraphQLQuery<T = any>(query: any, variables?: any) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.query({
        query,
        variables,
        fetchPolicy: 'network-only'
      });
      
      setData(result.data as T);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na consulta');
      console.error('GraphQL Query Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeQuery();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: executeQuery
  };
}
