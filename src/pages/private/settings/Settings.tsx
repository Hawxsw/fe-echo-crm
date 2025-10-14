import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/useToast';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  sessionTimeout: string;
  passwordPolicy: string;
}

interface AppearanceSettings {
  theme: string;
  language: string;
  timezone: string;
}

interface SystemSettings {
  autoSave: boolean;
  dataRetention: string;
  backupFrequency: string;
}

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  email: true,
  push: false,
  sms: false,
  marketing: false,
};

const DEFAULT_SECURITY: SecuritySettings = {
  twoFactor: false,
  sessionTimeout: '30',
  passwordPolicy: 'medium',
};

const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: 'light',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
};

const DEFAULT_SYSTEM: SystemSettings = {
  autoSave: true,
  dataRetention: '365',
  backupFrequency: 'daily',
};

export default function Settings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);
  const [security, setSecurity] = useState<SecuritySettings>(DEFAULT_SECURITY);
  const [appearance, setAppearance] = useState<AppearanceSettings>(DEFAULT_APPEARANCE);
  const [system, setSystem] = useState<SystemSettings>(DEFAULT_SYSTEM);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleReset = useCallback(() => {
    setNotifications(DEFAULT_NOTIFICATIONS);
    setSecurity(DEFAULT_SECURITY);
    setAppearance(DEFAULT_APPEARANCE);
    setSystem(DEFAULT_SYSTEM);
    
    toast({
      title: "Configurações restauradas",
      description: "As configurações foram restauradas para os valores padrão.",
      variant: "default",
    });
  }, [toast]);

  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Configurações
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light">
              Gerencie suas preferências e configurações da aplicação
            </p>
            <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex space-x-2"
          >
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="shadow-sm hover:shadow-md transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                Notificações
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Configure como e quando você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="font-medium text-slate-900">Notificações por Email</Label>
                  <p className="text-sm text-slate-500">Receba notificações importantes por email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications" className="font-medium text-slate-900">Notificações Push</Label>
                  <p className="text-sm text-slate-500">Receba notificações no navegador</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications" className="font-medium text-slate-900">Notificações SMS</Label>
                  <p className="text-sm text-slate-500">Receba notificações por SMS</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-notifications" className="font-medium text-slate-900">Notificações de Marketing</Label>
                  <p className="text-sm text-slate-500">Receba novidades e promoções</p>
                </div>
                <Switch
                  id="marketing-notifications"
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                Segurança
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Configure as opções de segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor" className="font-medium text-slate-900">Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-slate-500">Adicione uma camada extra de segurança</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={security.twoFactor}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactor: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout" className="font-medium text-slate-900">Timeout da Sessão (minutos)</Label>
                <Select
                  value={security.sessionTimeout}
                  onValueChange={(value) => setSecurity(prev => ({ ...prev, sessionTimeout: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-policy" className="font-medium text-slate-900">Política de Senha</Label>
                <Select
                  value={security.passwordPolicy}
                  onValueChange={(value) => setSecurity(prev => ({ ...prev, passwordPolicy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="strict">Rigorosa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <Palette className="w-5 h-5 text-purple-600" />
                </div>
                Aparência
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Personalize a aparência da aplicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme" className="font-medium text-slate-900">Tema</Label>
                <Select
                  value={appearance.theme}
                  onValueChange={(value) => setAppearance(prev => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="auto">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="font-medium text-slate-900">Idioma</Label>
                <Select
                  value={appearance.language}
                  onValueChange={(value) => setAppearance(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="font-medium text-slate-900">Fuso Horário</Label>
                <Select
                  value={appearance.timezone}
                  onValueChange={(value) => setAppearance(prev => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tóquio (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl">
                  <Database className="w-5 h-5 text-orange-600" />
                </div>
                Sistema
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Configurações avançadas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save" className="font-medium text-slate-900">Salvamento Automático</Label>
                  <p className="text-sm text-slate-500">Salva automaticamente as alterações</p>
                </div>
                <Switch
                  id="auto-save"
                  checked={system.autoSave}
                  onCheckedChange={(checked) => setSystem(prev => ({ ...prev, autoSave: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-retention" className="font-medium text-slate-900">Retenção de Dados (dias)</Label>
                <Select
                  value={system.dataRetention}
                  onValueChange={(value) => setSystem(prev => ({ ...prev, dataRetention: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                    <SelectItem value="180">180 dias</SelectItem>
                    <SelectItem value="365">1 ano</SelectItem>
                    <SelectItem value="730">2 anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-frequency" className="font-medium text-slate-900">Frequência de Backup</Label>
                <Select
                  value={system.backupFrequency}
                  onValueChange={(value) => setSystem(prev => ({ ...prev, backupFrequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              Status das Configurações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Sistema Operacional</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">OK</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Conexão de Rede</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">OK</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100 hover:bg-yellow-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Sincronização</span>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pendente</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
