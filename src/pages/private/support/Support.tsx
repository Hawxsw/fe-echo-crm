import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Send,
  ExternalLink,
  Download,
  Video,
  FileText,
  Users,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/useToast';

interface TicketForm {
  subject: string;
  category: string;
  priority: string;
  description: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  views: number;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  assignee: string;
}

interface Resource {
  title: string;
  description: string;
  type: string;
  size: string;
  downloads: number;
}

const INITIAL_TICKET_FORM: TicketForm = {
  subject: '',
  category: '',
  priority: '',
  description: ''
};

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "Como criar um novo usuário?",
    answer: "Para criar um novo usuário, vá até a seção 'Usuários' no menu lateral, clique em 'Adicionar Usuário' e preencha os dados necessários.",
    category: "Usuários",
    views: 245
  },
  {
    id: 2,
    question: "Como configurar notificações?",
    answer: "Acesse 'Configurações' no menu lateral e navegue até a aba 'Notificações' para personalizar suas preferências.",
    category: "Configurações",
    views: 189
  },
  {
    id: 3,
    question: "Como gerar relatórios?",
    answer: "Na seção 'Relatórios', selecione o tipo de relatório desejado, configure os filtros e clique em 'Gerar Relatório'.",
    category: "Relatórios",
    views: 156
  },
  {
    id: 4,
    question: "Como conectar WhatsApp?",
    answer: "Vá até 'WhatsApp' no menu, clique em 'Conectar Conta' e siga as instruções para vincular sua conta.",
    category: "Integrações",
    views: 134
  }
];

const TICKET_DATA: Ticket[] = [
  {
    id: 'TK-001',
    subject: 'Problema com login',
    status: 'open',
    priority: 'high',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    assignee: 'Suporte Técnico'
  },
  {
    id: 'TK-002',
    subject: 'Dúvida sobre relatórios',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-15',
    assignee: 'Ana Silva'
  },
  {
    id: 'TK-003',
    subject: 'Solicitação de nova funcionalidade',
    status: 'closed',
    priority: 'low',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12',
    assignee: 'João Santos'
  }
];

const RESOURCES: Resource[] = [
  {
    title: "Guia do Usuário",
    description: "Documentação completa sobre como usar o sistema",
    type: "PDF",
    size: "2.4 MB",
    downloads: 1247
  },
  {
    title: "Vídeo Tutorial - Primeiros Passos",
    description: "Aprenda os conceitos básicos em 15 minutos",
    type: "Vídeo",
    size: "45 MB",
    downloads: 892
  },
  {
    title: "API Documentation",
    description: "Documentação técnica para desenvolvedores",
    type: "HTML",
    size: "1.2 MB",
    downloads: 456
  },
  {
    title: "Política de Privacidade",
    description: "Como protegemos seus dados",
    type: "PDF",
    size: "0.8 MB",
    downloads: 234
  }
];

const STATUS_CONFIG = {
  open: { color: 'bg-red-100 text-red-700', label: 'Aberto' },
  in_progress: { color: 'bg-yellow-100 text-yellow-700', label: 'Em Andamento' },
  closed: { color: 'bg-green-100 text-green-700', label: 'Fechado' }
} as const;

const PRIORITY_CONFIG = {
  low: { color: 'bg-blue-100 text-blue-700', label: 'Baixa' },
  medium: { color: 'bg-yellow-100 text-yellow-700', label: 'Média' },
  high: { color: 'bg-red-100 text-red-700', label: 'Alta' }
} as const;

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.open;
  return <Badge className={config.color}>{config.label}</Badge>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const config = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG.medium;
  return <Badge className={config.color}>{config.label}</Badge>;
}

export default function Support() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketForm, setTicketForm] = useState<TicketForm>(INITIAL_TICKET_FORM);

  const handleSubmitTicket = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Ticket criado com sucesso",
        description: "Seu ticket foi enviado e você receberá uma resposta em breve.",
        variant: "default",
      });
      
      setTicketForm(INITIAL_TICKET_FORM);
    } catch (error) {
      toast({
        title: "Erro ao criar ticket",
        description: "Não foi possível enviar seu ticket. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  const filteredFAQ = FAQ_DATA.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Suporte
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light">
              Central de ajuda e suporte técnico
            </p>
            <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex space-x-2"
          >
            <Button variant="outline" className="shadow-sm hover:shadow-md transition-all">
              <Phone className="h-4 w-4 mr-2" />
              (11) 99999-9999
            </Button>
            <Button variant="outline" className="shadow-sm hover:shadow-md transition-all">
              <Mail className="h-4 w-4 mr-2" />
              suporte@echo.com
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Chat ao Vivo</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                Disponível
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Tempo médio de resposta: 2 minutos
              </p>
              <Button className="w-full shadow-sm hover:shadow-md transition-all">
                <MessageSquare className="h-4 w-4 mr-2" />
                Iniciar Chat
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Telefone</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                24/7
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Suporte telefônico disponível
              </p>
              <Button variant="outline" className="w-full shadow-sm hover:shadow-md transition-all">
                <Phone className="h-4 w-4 mr-2" />
                Ligar Agora
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Email</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-transform duration-300 group-hover:scale-110">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                &lt; 24h
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Resposta por email
              </p>
              <Button variant="outline" className="w-full shadow-sm hover:shadow-md transition-all">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs defaultValue="faq" className="space-y-4">
          <TabsList>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tickets">Meus Tickets</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar na base de conhecimento..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFAQ.map((item) => (
                <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base text-slate-900">{item.question}</CardTitle>
                        <CardDescription className="mt-2 text-slate-600">{item.answer}</CardDescription>
                      </div>
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{item.views} visualizações</span>
                      <Button variant="ghost" size="sm" className="hover:bg-purple-50">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ver mais
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Meus Tickets de Suporte</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Acompanhe o status dos seus tickets
                  </CardDescription>
                </div>
                <Button className="shadow-sm hover:shadow-md transition-all">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Novo Ticket
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {TICKET_DATA.map((ticket) => (
                  <div key={ticket.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-slate-900">{ticket.subject}</h4>
                          <StatusBadge status={ticket.status} />
                          <PriorityBadge priority={ticket.priority} />
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>ID: {ticket.id}</span>
                          <span>Criado: {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                          <span>Responsável: {ticket.assignee}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Recursos e Documentação</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Materiais de apoio para usar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {RESOURCES.map((resource, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {resource.type === 'PDF' && <FileText className="h-4 w-4 text-red-500" />}
                            {resource.type === 'Vídeo' && <Video className="h-4 w-4 text-blue-500" />}
                            {resource.type === 'HTML' && <Globe className="h-4 w-4 text-green-500" />}
                            <h4 className="font-semibold text-slate-900">{resource.title}</h4>
                          </div>
                          <p className="text-sm text-slate-600">{resource.description}</p>
                        </div>
                        <Badge variant="secondary">{resource.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          {resource.size} • {resource.downloads} downloads
                        </span>
                        <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all">
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    Enviar Ticket de Suporte
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Descreva seu problema ou dúvida e nossa equipe entrará em contato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto</Label>
                      <Input
                        id="subject"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Descreva brevemente o problema"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select
                          value={ticketForm.category}
                          onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Técnico</SelectItem>
                            <SelectItem value="billing">Faturamento</SelectItem>
                            <SelectItem value="feature">Funcionalidade</SelectItem>
                            <SelectItem value="other">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Prioridade</Label>
                        <Select
                          value={ticketForm.priority}
                          onValueChange={(value) => setTicketForm(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva detalhadamente o problema ou dúvida..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full shadow-lg hover:shadow-xl transition-all duration-200" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Ticket
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      Equipe de Suporte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Ana Silva</p>
                        <p className="text-sm text-slate-500">Suporte Técnico</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">João Santos</p>
                        <p className="text-sm text-slate-500">Gerente de Suporte</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Maria Costa</p>
                        <p className="text-sm text-slate-500">Especialista em Integrações</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      Horários de Atendimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Segunda a Sexta:</span>
                      <span className="text-sm font-medium text-slate-900">8h às 18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Sábado:</span>
                      <span className="text-sm font-medium text-slate-900">9h às 13h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Domingo:</span>
                      <span className="text-sm font-medium text-slate-900">Fechado</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-700 font-medium">Suporte 24/7 para emergências</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
