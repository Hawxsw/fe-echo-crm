import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApiService } from '@/contexts/ApiContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks';
import { IUpdateUser } from '@/types/user';
import { User, Lock, Mail, Phone, Briefcase } from 'lucide-react';

interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const MIN_PASSWORD_LENGTH = 6;

const LoadingState = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-muted-foreground">Carregando...</p>
  </div>
);

const ProfileHeader = ({ user }: { user: NonNullable<ReturnType<typeof useAuth>['currentUser']> }) => {
  const initials = useMemo(() => 
    `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(), 
    [user.firstName, user.lastName]
  );

  const roleName = useMemo(() => 
    typeof user.role === 'object' ? user.role.name : user.role,
    [user.role]
  );

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar ?? undefined} alt={initials} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex gap-4 mt-2">
              <span className="text-sm text-muted-foreground">{roleName}</span>
              {user.department && (
                <>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {user.department.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SystemInfo = ({ user }: { user: NonNullable<ReturnType<typeof useAuth>['currentUser']> }) => {
  const statusConfig = useMemo(() => ({
    ACTIVE: { label: 'Ativo', className: 'text-green-600' },
    INACTIVE: { label: 'Inativo', className: 'text-red-600' },
    SUSPENDED: { label: 'Suspenso', className: 'text-red-600' }
  }), []);

  const formatDate = useCallback((dateString: string) => 
    new Date(dateString).toLocaleDateString('pt-BR'), 
    []
  );

  const status = statusConfig[user.status];

  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium mb-4">Informações do Sistema</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Status:</span>
          <span className={`ml-2 font-medium ${status.className}`}>
            {status.label}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Membro desde:</span>
          <span className="ml-2 font-medium">
            {formatDate(user.createdAt)}
          </span>
        </div>
        {user.lastLoginAt && (
          <div>
            <span className="text-muted-foreground">Último acesso:</span>
            <span className="ml-2 font-medium">
              {formatDate(user.lastLoginAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const InputWithIcon = ({ 
  icon: Icon, 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  required = false,
  minLength
}: {
  icon: React.ComponentType<{ className?: string }>;
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  minLength?: number;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
    </div>
  </div>
);

const PersonalInfoForm = ({ 
  formData, 
  onUpdate, 
  onReset, 
  isSubmitting,
  onSubmit
}: {
  formData: PersonalInfoForm;
  onUpdate: (field: keyof PersonalInfoForm, value: string) => void;
  onReset: () => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>
          Atualize suas informações pessoais e de contato
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              icon={User}
              id="firstName"
              label="Nome"
              value={formData.firstName}
              onChange={(value) => onUpdate('firstName', value)}
              placeholder="Seu nome"
              required
            />
            <InputWithIcon
              icon={User}
              id="lastName"
              label="Sobrenome"
              value={formData.lastName}
              onChange={(value) => onUpdate('lastName', value)}
              placeholder="Seu sobrenome"
              required
            />
          </div>

          <InputWithIcon
            icon={Mail}
            id="email"
            label="Email"
            value={formData.email}
            onChange={(value) => onUpdate('email', value)}
            placeholder="seu.email@exemplo.com"
            type="email"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              icon={Phone}
              id="phone"
              label="Telefone"
              value={formData.phone}
              onChange={(value) => onUpdate('phone', value)}
              placeholder="(00) 00000-0000"
              type="tel"
            />
            <InputWithIcon
              icon={Briefcase}
              id="position"
              label="Cargo"
              value={formData.position}
              onChange={(value) => onUpdate('position', value)}
              placeholder="Seu cargo"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onReset}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const PasswordForm = ({ 
  formData, 
  onUpdate, 
  onReset, 
  isSubmitting,
  onSubmit
}: {
  formData: PasswordForm;
  onUpdate: (field: keyof PasswordForm, value: string) => void;
  onReset: () => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
        <CardDescription>
          Altere sua senha para manter sua conta segura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <InputWithIcon
            icon={Lock}
            id="currentPassword"
            label="Senha Atual"
            value={formData.currentPassword}
            onChange={(value) => onUpdate('currentPassword', value)}
            placeholder="Digite sua senha atual"
            type="password"
            required
          />

          <div className="space-y-2">
            <InputWithIcon
              icon={Lock}
              id="newPassword"
              label="Nova Senha"
              value={formData.newPassword}
              onChange={(value) => onUpdate('newPassword', value)}
              placeholder="Digite sua nova senha"
              type="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
            />
            <p className="text-xs text-muted-foreground">
              Mínimo de {MIN_PASSWORD_LENGTH} caracteres
            </p>
          </div>

          <InputWithIcon
            icon={Lock}
            id="confirmPassword"
            label="Confirmar Nova Senha"
            value={formData.confirmPassword}
            onChange={(value) => onUpdate('confirmPassword', value)}
            placeholder="Confirme sua nova senha"
            type="password"
            required
            minLength={MIN_PASSWORD_LENGTH}
          />

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onReset}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Profile() {
  const { currentUser, getMe } = useAuth();
  const apiService = useApiService();
  const { toast } = useToast();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoForm>({
    firstName: currentUser?.firstName ?? '',
    lastName: currentUser?.lastName ?? '',
    email: currentUser?.email ?? '',
    phone: currentUser?.phone ?? '',
    position: currentUser?.position ?? '',
  });
  
  const [passwordInfo, setPasswordInfo] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const updatePersonalInfo = useCallback((field: keyof PersonalInfoForm, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const updatePasswordInfo = useCallback((field: keyof PasswordForm, value: string) => {
    setPasswordInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetPersonalInfo = useCallback(() => {
    if (!currentUser) return;
    
    setPersonalInfo({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phone: currentUser.phone ?? '',
      position: currentUser.position ?? '',
    });
  }, [currentUser]);

  const resetPasswordInfo = useCallback(() => {
    setPasswordInfo({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, []);

  const handleUpdateProfile = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setIsUpdating(true);
    
    try {
      const updateData: IUpdateUser = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone || undefined,
        position: personalInfo.position || undefined,
      };

      await apiService.users.updateUser(currentUser.id, updateData);
      await getMe();
      
      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso!',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  }, [currentUser, personalInfo, apiService.users, getMe, toast]);

  const handleChangePassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem',
        variant: 'destructive',
      });
      return;
    }
    
    if (passwordInfo.newPassword.length < MIN_PASSWORD_LENGTH) {
      toast({
        title: 'Erro',
        description: `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`,
        variant: 'destructive',
      });
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      toast({
        title: 'Informação',
        description: 'Funcionalidade de alteração de senha em desenvolvimento',
      });
      
      resetPasswordInfo();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao alterar senha';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  }, [passwordInfo, toast, resetPasswordInfo]);

  if (!currentUser) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Perfil</h1>
        <p className="text-muted-foreground mt-2">Gerencie as informações da sua conta</p>
      </div>

      <ProfileHeader user={currentUser} />

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Informações Pessoais
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoForm
            formData={personalInfo}
            onUpdate={updatePersonalInfo}
            onReset={resetPersonalInfo}
            isSubmitting={isUpdating}
            onSubmit={handleUpdateProfile}
          />
          <SystemInfo user={currentUser} />
        </TabsContent>

        <TabsContent value="security">
          <PasswordForm
            formData={passwordInfo}
            onUpdate={updatePasswordInfo}
            onReset={resetPasswordInfo}
            isSubmitting={isChangingPassword}
            onSubmit={handleChangePassword}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

