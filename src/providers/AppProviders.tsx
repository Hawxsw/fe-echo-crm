import { ReactNode } from 'react';
import { ApiProvider } from '@/contexts/ApiContext';
import {
  AuthProvider,
  UsersProvider,
  BoardsProvider,
  RolesProvider,
  DepartmentsProvider,
  ChatProvider,
  ConversationsProvider,
  MessagesProvider,
  WhatsAppMessagesProvider,
  CardsProvider,
  ColumnsProvider,
  CommentsProvider,
} from '@/hooks';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Componente que centraliza todos os providers da aplicação.
 * 
 * Benefícios:
 * - Remove o "Provider Hell" do main.tsx
 * - Facilita a manutenção e visualização dos providers
 * - Permite reorganizar a ordem dos providers facilmente
 * - Melhora a legibilidade do código
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ApiProvider>
      <AuthProvider>
        <UsersProvider>
          <DepartmentsProvider>
            <RolesProvider>
              <BoardsProvider>
                <ColumnsProvider>
                  <CardsProvider>
                    <CommentsProvider>
                      <ChatProvider>
                        <ConversationsProvider>
                          <MessagesProvider>
                            <WhatsAppMessagesProvider>
                              {children}
                            </WhatsAppMessagesProvider>
                          </MessagesProvider>
                        </ConversationsProvider>
                      </ChatProvider>
                    </CommentsProvider>
                  </CardsProvider>
                </ColumnsProvider>
              </BoardsProvider>
            </RolesProvider>
          </DepartmentsProvider>
        </UsersProvider>
      </AuthProvider>
    </ApiProvider>
  );
}

