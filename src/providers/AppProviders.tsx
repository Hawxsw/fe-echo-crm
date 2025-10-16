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
