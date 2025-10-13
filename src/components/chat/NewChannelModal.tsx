import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Lock, Users, Plus, X, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface NewChannelModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name?: string;
    isGroup: boolean;
    description?: string;
    isPrivate?: boolean;
    participantIds: string[];
  }) => void;
  users: User[];
  currentUserId: string;
}

const channelColors = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
];

const channelIcons = ['💬', '📢', '🚀', '💼', '🎨', '💻', '📊', '🎯'];

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const NewChannelModal = ({
  open,
  onClose,
  onCreate,
  users,
  currentUserId,
}: NewChannelModalProps) => {
  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedColor, setSelectedColor] = useState(channelColors[0]);
  const [selectedIcon, setSelectedIcon] = useState(channelIcons[0]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users
    .filter(user => user.id !== currentUserId)
    .filter(user => {
      if (!searchQuery) return true;
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) || 
             user.email.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = () => {
    if (chatType === 'direct' && selectedUsers.length !== 1) return;
    if (chatType === 'group' && (selectedUsers.length === 0 || !channelName.trim())) return;

    onCreate({
      name: chatType === 'group' ? channelName.trim() : undefined,
      isGroup: chatType === 'group',
      description: description.trim() || undefined,
      isPrivate: chatType === 'group' ? isPrivate : undefined,
      participantIds: selectedUsers,
    });

    handleClose();
  };

  const handleClose = () => {
    setChannelName('');
    setDescription('');
    setIsPrivate(false);
    setSelectedUsers([]);
    setSearchQuery('');
    setChatType('direct');
    setSelectedColor(channelColors[0]);
    setSelectedIcon(channelIcons[0]);
    onClose();
  };

  const isValid = chatType === 'direct'
    ? selectedUsers.length === 1
    : selectedUsers.length > 0 && channelName.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nova Conversa
          </DialogTitle>
          <DialogDescription>
            Crie uma nova conversa direta ou um canal de equipe
          </DialogDescription>
        </DialogHeader>

        <Tabs value={chatType} onValueChange={(v) => setChatType(v as 'direct' | 'group')} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="direct" className="gap-2">
              <Users className="h-4 w-4" />
              Mensagem Direta
            </TabsTrigger>
            <TabsTrigger value="group" className="gap-2">
              <Hash className="h-4 w-4" />
              Canal / Grupo
            </TabsTrigger>
          </TabsList>

          {/* Direct Message */}
          <TabsContent value="direct" className="flex-1 overflow-hidden flex flex-col mt-0 space-y-4">
            <div className="space-y-2">
              <Label>Selecione um colaborador</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-border rounded-lg">
              <div className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhum colaborador encontrado
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => toggleUserSelection(user.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors',
                        selectedUsers.includes(user.id) && 'bg-accent'
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      {user.role && (
                        <Badge variant="secondary" className="text-xs">
                          {user.role}
                        </Badge>
                      )}
                      {selectedUsers.includes(user.id) && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          >
                            ✓
                          </motion.div>
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Group/Channel */}
          <TabsContent value="group" className="flex-1 overflow-hidden flex flex-col mt-0 space-y-4">
            <div className="space-y-4">
              {/* Channel Info */}
              <div className="space-y-2">
                <Label htmlFor="channel-name">Nome do canal *</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="channel-name"
                      placeholder="marketing, vendas, dev..."
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      className="pl-9"
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Sobre o que é este canal?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none h-20"
                  maxLength={200}
                />
              </div>

              {/* Customização */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cor do canal</Label>
                  <div className="flex flex-wrap gap-2">
                    {channelColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          'h-8 w-8 rounded-lg transition-all',
                          selectedColor === color && 'ring-2 ring-offset-2 ring-primary'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ícone do canal</Label>
                  <div className="flex flex-wrap gap-2">
                    {channelIcons.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setSelectedIcon(icon)}
                        className={cn(
                          'h-8 w-8 rounded-lg bg-accent hover:bg-accent/80 transition-all text-lg',
                          selectedIcon === icon && 'ring-2 ring-offset-2 ring-primary'
                        )}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                    {isPrivate ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Hash className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {isPrivate ? 'Canal Privado' : 'Canal Público'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isPrivate 
                        ? 'Apenas membros convidados podem ver e participar'
                        : 'Qualquer pessoa da equipe pode ver e participar'}
                    </p>
                  </div>
                </div>
                <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>

              {/* Members */}
              <div className="space-y-2">
                <Label>Adicionar membros ({selectedUsers.length})</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar colaboradores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Selected Users Preview */}
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 bg-accent rounded-lg">
                    {selectedUsers.map(userId => {
                      const user = users.find(u => u.id === userId);
                      if (!user) return null;
                      return (
                        <Badge key={userId} variant="secondary" className="gap-1 pr-1">
                          {user.firstName} {user.lastName}
                          <button
                            onClick={() => toggleUserSelection(userId)}
                            className="ml-1 hover:bg-muted rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto border border-border rounded-lg">
              <div className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhum colaborador encontrado
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => toggleUserSelection(user.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors',
                        selectedUsers.includes(user.id) && 'bg-accent'
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                          ✓
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!isValid}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {chatType === 'direct' ? 'Criar Conversa' : 'Criar Canal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

