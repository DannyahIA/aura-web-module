import client from './apollo-client';
import { REGISTER, LOGIN, CREATE_BANK, CREATE_TRANSACTION } from './graphql-queries';

// Função para testar a integração completa
export async function testIntegration() {
  try {
    console.log('🚀 Iniciando teste de integração...');

    // 1. Registrar um usuário de teste
    console.log('📝 Registrando usuário de teste...');
    const registerResult = await client.mutate({
      mutation: REGISTER,
      variables: {
        input: {
          name: 'Usuário Teste',
          email: 'teste@aura.com',
          password: '123456',
          phoneNumber: '+55 11 99999-9999'
        }
      }
    });

    if ((registerResult.data as any)?.register) {
      console.log('✅ Usuário registrado com sucesso:', (registerResult.data as any).register.user);
      
      // Armazenar token para próximas requisições
      const token = (registerResult.data as any).register.token;
      localStorage.setItem('aura-token', token);
      
      // 2. Fazer login
      console.log('🔐 Fazendo login...');
      const loginResult = await client.mutate({
        mutation: LOGIN,
        variables: {
          input: {
            email: 'teste@aura.com',
            password: '123456'
          }
        }
      });

      if ((loginResult.data as any)?.login) {
        console.log('✅ Login realizado com sucesso:', (loginResult.data as any).login.user);
        
        const userId = (loginResult.data as any).login.user.id;
        
        // 3. Criar um banco
        console.log('🏦 Criando banco de teste...');
        const bankResult = await client.mutate({
          mutation: CREATE_BANK,
          variables: {
            input: {
              name: 'Banco Teste',
              userId: userId
            }
          }
        });

        if ((bankResult.data as any)?.createBank) {
          console.log('✅ Banco criado com sucesso:', (bankResult.data as any).createBank);
          
          const bankId = (bankResult.data as any).createBank.id;
          
          // 4. Criar uma transação
          console.log('💰 Criando transação de teste...');
          const transactionResult = await client.mutate({
            mutation: CREATE_TRANSACTION,
            variables: {
              input: {
                bankId: bankId,
                type: 'PIX',
                amount: 100.50,
                currency: 'BRL',
                description: 'PIX de teste',
                transactionDate: new Date().toISOString()
              }
            }
          });

          if ((transactionResult.data as any)?.createTransaction) {
            console.log('✅ Transação criada com sucesso:', (transactionResult.data as any).createTransaction);
            console.log('🎉 Teste de integração concluído com sucesso!');
            
            return {
              success: true,
              user: (loginResult.data as any).login.user,
              bank: (bankResult.data as any).createBank,
              transaction: (transactionResult.data as any).createTransaction
            };
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Erro no teste de integração:', error);
    return {
      success: false,
      error: error
    };
  }
}

// Função para limpar dados de teste
export async function cleanupTestData() {
  // Esta função pode ser implementada quando tivermos mutations de delete
  console.log('🧹 Limpeza de dados de teste seria implementada aqui');
}
