import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquareText,
  Star,
  ThumbsUp,
  Send,
  Heart,
  Lightbulb,
  Bug,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  MessageCircle,
  Smile,
  Frown,
  Meh,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/useToast';
import { useApi } from '@/hooks/useApi';
import { IFeedback, IFeedbackStats } from '@/types/feedback';

interface FeedbackForm {
  type: string;
  category: string;
  rating: number;
  title: string;
  description: string;
  priority: string;
  isAnonymous: boolean;
}

const INITIAL_FORM_STATE: FeedbackForm = {
  type: '',
  category: '',
  rating: 0,
  title: '',
  description: '',
  priority: '',
  isAnonymous: false
};


const FEEDBACK_TYPE_CONFIG = {
  SUGGESTION: { icon: Lightbulb, color: 'text-yellow-500', label: 'Sugestão' },
  BUG: { icon: Bug, color: 'text-red-500', label: 'Bug/Problema' },
  COMPLIMENT: { icon: Heart, color: 'text-pink-500', label: 'Elogio' },
  COMPLAINT: { icon: AlertTriangle, color: 'text-orange-500', label: 'Reclamação' }
} as const;

const STATUS_CONFIG = {
  UNDER_REVIEW: { color: 'bg-yellow-100 text-yellow-700', label: 'Em Análise' },
  PLANNED: { color: 'bg-blue-100 text-blue-700', label: 'Planejado' },
  IN_PROGRESS: { color: 'bg-purple-100 text-purple-700', label: 'Em Desenvolvimento' },
  FIXED: { color: 'bg-green-100 text-green-700', label: 'Implementado' },
  ACKNOWLEDGED: { color: 'bg-gray-100 text-gray-700', label: 'Reconhecido' }
} as const;

const RATING_LABELS: Record<number, string> = {
  1: 'Péssimo',
  2: 'Ruim',
  3: 'Regular',
  4: 'Bom',
  5: 'Excelente'
};

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

function StarRating({ rating, interactive = false, onRatingChange }: StarRatingProps) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange?.(star)}
          className={`${
            interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          } transition-transform`}
          disabled={!interactive}
        >
          <Star
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

interface FeedbackIconProps {
  type: string;
}

function FeedbackIcon({ type }: FeedbackIconProps) {
  const config = FEEDBACK_TYPE_CONFIG[type.toUpperCase() as keyof typeof FEEDBACK_TYPE_CONFIG] || {
    icon: MessageCircle,
    color: 'text-blue-500'
  };
  const Icon = config.icon;
  return <Icon className={`h-4 w-4 ${config.color}`} />;
}

interface StatusBadgeProps {
  status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status.toUpperCase() as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.UNDER_REVIEW;
  return <Badge className={config.color}>{config.label}</Badge>;
}

export default function Feedback() {
  const api = useApi();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>(INITIAL_FORM_STATE);
  const [stats, setStats] = useState<IFeedbackStats | null>(null);
  const [feedbackList, setFeedbackList] = useState<IFeedback[]>([]);
  const [topSuggestions, setTopSuggestions] = useState<IFeedback[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [statsData, feedbackData, suggestionsData] = await Promise.all([
          api.feedback.getStats().catch(() => null),
          api.feedback.findAll(1, 10).catch(() => ({ data: [] })),
          api.feedback.getTopSuggestions(4).catch(() => [])
        ]);
        
        setStats(statsData);
        setFeedbackList(feedbackData?.data || []);
        setTopSuggestions(Array.isArray(suggestionsData) ? suggestionsData : []);
      } catch (error) {
        console.warn('Error loading feedback data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [api.feedback]);

  const handleSubmitFeedback = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.feedback.create({
        type: feedbackForm.type as any,
        category: feedbackForm.category as any,
        title: feedbackForm.title,
        description: feedbackForm.description,
        rating: feedbackForm.rating,
        priority: feedbackForm.priority as any,
        isAnonymous: feedbackForm.isAnonymous,
      });

      toast({
        title: "Feedback enviado com sucesso",
        description: "Obrigado pelo seu feedback! Ele será analisado pela nossa equipe.",
        variant: "default",
      });

      setFeedbackForm(INITIAL_FORM_STATE);
      
      const [statsData, feedbackData] = await Promise.all([
        api.feedback.getStats(),
        api.feedback.findAll(1, 10),
      ]);
      setStats(statsData);
      setFeedbackList(feedbackData.data || []);
    } catch (error) {
      toast({
        title: "Erro ao enviar feedback",
        description: "Não foi possível enviar seu feedback. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [feedbackForm, api.feedback, toast]);

  const handleVote = useCallback(async (feedbackId: string) => {
    try {
      await api.feedback.toggleVote(feedbackId);
      
      toast({
        title: "Voto registrado",
        description: "Seu voto foi contabilizado com sucesso.",
        variant: "default",
      });

      const suggestionsData = await api.feedback.getTopSuggestions(4);
      setTopSuggestions(Array.isArray(suggestionsData) ? suggestionsData : []);
    } catch (error) {
      toast({
        title: "Erro ao votar",
        description: "Não foi possível registrar seu voto. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [api.feedback, toast]);

  const handleRatingChange = useCallback((rating: number) => {
    setFeedbackForm(prev => ({ ...prev, rating }));
  }, []);

  const updateFormField = useCallback(<K extends keyof FeedbackForm>(
    field: K,
    value: FeedbackForm[K]
  ) => {
    setFeedbackForm(prev => ({ ...prev, [field]: value }));
  }, []);

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
              Feedback
            </h1>
            <p className="text-muted-foreground mt-2 text-base font-light">
              Sua opinião é fundamental para melhorarmos o sistema
            </p>
            <div className="absolute -top-1 -left-1 w-20 h-20 bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>
          {stats && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 shadow-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% este mês
            </Badge>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Feedback</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-transform duration-300 group-hover:scale-110">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {(stats?.total ?? 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats?.thisMonth ?? 0} este mês
              </p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Avaliação Média</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {(stats?.averageRating ?? 0).toFixed(1)}
              </div>
              <div className="flex items-center space-x-1">
                <StarRating rating={Math.floor(stats?.averageRating ?? 0)} />
              </div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Resposta</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                87%
              </div>
              <p className="text-xs text-muted-foreground">
                Feedback respondido
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Implementações</CardTitle>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 transition-transform duration-300 group-hover:scale-110">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                156
              </div>
              <p className="text-xs text-muted-foreground">
                Sugestões implementadas
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Enviar Feedback</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="suggestions">Sugestões</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                      <MessageSquareText className="w-5 h-5 text-purple-600" />
                    </div>
                    Envie seu Feedback
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                  Compartilhe suas ideias, reporte problemas ou envie elogios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="feedback-type">Tipo de Feedback</Label>
                      <Select
                        value={feedbackForm.type}
                        onValueChange={(value) => updateFormField('type', value)}
                      >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="SUGGESTION">Sugestão</SelectItem>
                          <SelectItem value="BUG">Bug/Problema</SelectItem>
                          <SelectItem value="COMPLIMENT">Elogio</SelectItem>
                          <SelectItem value="COMPLAINT">Reclamação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback-category">Categoria</Label>
                      <Select
                        value={feedbackForm.category}
                        onValueChange={(value) => updateFormField('category', value)}
                      >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="UI">Interface do Usuário</SelectItem>
                          <SelectItem value="PERFORMANCE">Performance</SelectItem>
                          <SelectItem value="FEATURE">Funcionalidade</SelectItem>
                          <SelectItem value="INTEGRATION">Integração</SelectItem>
                          <SelectItem value="DOCUMENTATION">Documentação</SelectItem>
                          <SelectItem value="OTHER">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Avaliação Geral</Label>
                    <div className="flex items-center space-x-2">
                      <StarRating
                        rating={feedbackForm.rating}
                        interactive
                        onRatingChange={handleRatingChange}
                      />
                      {feedbackForm.rating > 0 && (
                        <span className="text-sm text-slate-500 ml-2">
                            {RATING_LABELS[feedbackForm.rating]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback-title">Título</Label>
                    <Input
                      id="feedback-title"
                      value={feedbackForm.title}
                        onChange={(e) => updateFormField('title', e.target.value)}
                      placeholder="Resuma seu feedback em poucas palavras"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback-description">Descrição Detalhada</Label>
                    <Textarea
                      id="feedback-description"
                      value={feedbackForm.description}
                        onChange={(e) => updateFormField('description', e.target.value)}
                      placeholder="Descreva detalhadamente seu feedback, incluindo passos para reproduzir problemas..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="feedback-priority">Prioridade</Label>
                      <Select
                        value={feedbackForm.priority}
                        onValueChange={(value) => updateFormField('priority', value)}
                      >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="LOW">Baixa</SelectItem>
                          <SelectItem value="MEDIUM">Média</SelectItem>
                          <SelectItem value="HIGH">Alta</SelectItem>
                          <SelectItem value="CRITICAL">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={feedbackForm.isAnonymous}
                        onChange={(e) => updateFormField('isAnonymous', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="anonymous" className="text-sm">
                      Enviar anonimamente
                    </Label>
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
                        Enviar Feedback
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
                      <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                      </div>
                      Feedback Rápido
                  </CardTitle>
                    <CardDescription className="text-sm mt-1">
                    Envie feedback rápido sobre sua experiência
                  </CardDescription>
                </CardHeader>
                  <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-1 hover:bg-green-50 transition-colors">
                        <Smile className="h-5 w-5 text-green-500" />
                        <span className="text-xs">Ótimo!</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-1 hover:bg-yellow-50 transition-colors">
                        <Meh className="h-5 w-5 text-yellow-500" />
                        <span className="text-xs">Regular</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-1 hover:bg-red-50 transition-colors">
                        <Frown className="h-5 w-5 text-red-500" />
                        <span className="text-xs">Ruim</span>
                      </Button>
                  </div>
                </CardContent>
              </Card>

                <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                        <Award className="w-5 h-5 text-blue-600" />
                      </div>
                      Suas Contribuições
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Feedback enviados:</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Sugestões implementadas:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Votos dados:</span>
                      <Badge variant="secondary">47</Badge>
                    </div>
                </CardContent>
              </Card>

                <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      Top Sugestões
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {(topSuggestions || []).slice(0, 3).map((suggestion) => (
                      <div key={suggestion.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-slate-900">{suggestion.title}</p>
                          <p className="text-xs text-slate-500 truncate">{suggestion.votesCount || 0} votos</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(suggestion.id)}
                          className="hover:bg-purple-100"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                      </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  Feedback Recente
                </CardTitle>
                  <CardDescription className="text-sm mt-1">
                  {(feedbackList || []).length} {(feedbackList || []).length === 1 ? 'feedback encontrado' : 'feedbacks encontrados'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
                ) : (feedbackList || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum feedback encontrado</p>
                ) : (feedbackList || []).map((feedback) => (
                  <div key={feedback.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                          <FeedbackIcon type={feedback.type} />
                          <h4 className="font-semibold text-slate-900">{feedback.title}</h4>
                          <StatusBadge status={feedback.status} />
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <StarRating rating={feedback.rating} />
                        </div>
                          <span>{new Date(feedback.createdAt).toLocaleDateString('pt-BR')}</span>
                        <span>{feedback.votesCount || 0} votos</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-purple-100"
                          onClick={() => handleVote(feedback.id)}
                        >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {feedback.votesCount || 0}
                      </Button>
                        <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all">
                        Ver Detalhes
                      </Button>
                      </div>
                    </div>
                  </div>
                ))}
                </CardContent>
              </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                  </div>
                  Sugestões da Comunidade
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Propostas e ideias da comunidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
                ) : (topSuggestions || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhuma sugestão encontrada</p>
                ) : (topSuggestions || []).map((suggestion) => (
                  <div key={suggestion.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <h4 className="font-semibold text-slate-900">{suggestion.title}</h4>
                          <StatusBadge status={suggestion.status} />
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{suggestion.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span>{suggestion.votesCount || 0} votos</span>
                        <span>Proposta pela comunidade</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleVote(suggestion.id)}
                          className="hover:bg-yellow-100"
                        >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {suggestion.votesCount || 0}
                      </Button>
                        <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all">
                        Comentar
                      </Button>
                      </div>
                    </div>
                  </div>
                ))}
                </CardContent>
              </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      Em Desenvolvimento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="font-medium text-sm text-slate-900">Relatórios personalizados</p>
                      <p className="text-xs text-slate-500">Previsão: Março 2024</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="font-medium text-sm text-slate-900">API pública</p>
                      <p className="text-xs text-slate-500">Previsão: Abril 2024</p>
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
                      <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
                        <Calendar className="w-5 h-5 text-yellow-600" />
                      </div>
                      Planejado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <p className="font-medium text-sm text-slate-900">Integração com Slack</p>
                      <p className="text-xs text-slate-500">Previsão: Maio 2024</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <p className="font-medium text-sm text-slate-900">App mobile</p>
                      <p className="text-xs text-slate-500">Previsão: Junho 2024</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      <p className="font-medium text-sm text-slate-900">Modo escuro</p>
                      <p className="text-xs text-slate-500">Previsão: Julho 2024</p>
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
                      <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      Implementado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="font-medium text-sm text-slate-900">Chat interno</p>
                      <p className="text-xs text-slate-500">Janeiro 2024</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="font-medium text-sm text-slate-900">Notificações push</p>
                      <p className="text-xs text-slate-500">Dezembro 2023</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="font-medium text-sm text-slate-900">Exportação de dados</p>
                      <p className="text-xs text-slate-500">Novembro 2023</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
          </div>
        </TabsContent>
      </Tabs>
      </motion.div>
    </div>
  );
}
