import { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel } from '@/components/ui/carousel';
import {
  MessageCircle,
  Kanban,
  Users,
  MessageSquare,
  Building2,
  Shield,
  Zap,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: MessageCircle,
    title: 'Atendimento WhatsApp',
    description: 'Centralize conversas do WhatsApp em um só lugar. Atribua atendimentos automaticamente, responda clientes e mantenha histórico completo de interações.',
    color: 'from-green-500/20 to-green-500/5',
    borderColor: 'border-green-500/30',
    activeBorderColor: 'border-green-500',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Kanban,
    title: 'Pipeline de Vendas',
    description: 'Controle todo o funil de vendas com visualização em kanban. Acompanhe leads, negociações e fechamentos. Defina etapas personalizadas para seu processo comercial.',
    color: 'from-purple-500/20 to-purple-500/5',
    borderColor: 'border-purple-500/30',
    activeBorderColor: 'border-purple-500',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: MessageSquare,
    title: 'Chat Interno',
    description: 'Comunicação instantânea entre sua equipe. Chats privados, grupos por departamento e notificações em tempo real. Mantenha todos alinhados e produtivos.',
    color: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'border-blue-500/30',
    activeBorderColor: 'border-blue-500',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Building2,
    title: 'Gestão de Empresas',
    description: 'Administre múltiplas empresas em uma única plataforma. Separe dados por cliente, departamento ou filial. Controle total e isolamento completo de informações.',
    color: 'from-orange-500/20 to-orange-500/5',
    borderColor: 'border-orange-500/30',
    activeBorderColor: 'border-orange-500',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    title: 'Controle de Acesso',
    description: 'Gerencie permissões detalhadas para cada usuário. Defina níveis de acesso, restrições por área e controle total sobre quem pode ver e editar informações.',
    color: 'from-cyan-500/20 to-cyan-500/5',
    borderColor: 'border-cyan-500/30',
    activeBorderColor: 'border-cyan-500',
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Proteção avançada para seus dados comerciais. Criptografia, backup automático e conformidade com LGPD. Suas informações sempre seguras e acessíveis.',
    color: 'from-red-500/20 to-red-500/5',
    borderColor: 'border-red-500/30',
    activeBorderColor: 'border-red-500',
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    gradient: 'from-red-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Automação Inteligente',
    description: 'Automatize tarefas repetitivas e acelere seu processo de vendas. Workflows automáticos, lembretes inteligentes e integração com ferramentas externas.',
    color: 'from-yellow-500/20 to-yellow-500/5',
    borderColor: 'border-yellow-500/30',
    activeBorderColor: 'border-yellow-500',
    iconBg: 'bg-yellow-500/20',
    iconColor: 'text-yellow-400',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: LayoutDashboard,
    title: 'Relatórios Avançados',
    description: 'Dashboards personalizáveis com métricas de vendas, performance da equipe e análise de conversões. Tome decisões baseadas em dados reais.',
    color: 'from-pink-500/20 to-pink-500/5',
    borderColor: 'border-pink-500/30',
    activeBorderColor: 'border-pink-500',
    iconBg: 'bg-pink-500/20',
    iconColor: 'text-pink-400',
    gradient: 'from-pink-500 to-purple-500',
  },
];

export default function Features() {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const handleCardClick = (index: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const featureCards = features.map((feature, globalIndex) => {
    const isExpanded = expandedCards.has(globalIndex);

    return (
      <div key={globalIndex} className="flex">
        <Card
          onClick={() => handleCardClick(globalIndex)}
          className={`
            relative cursor-pointer overflow-hidden
            bg-gradient-to-br ${feature.color} backdrop-blur-sm
            border-2 ${isExpanded ? feature.activeBorderColor : feature.borderColor}
            hover:shadow-2xl
            transition-all duration-300 ease-out
            ${isExpanded ? 'scale-105' : 'hover:scale-[1.02]'}
            w-full h-full
          `}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 hover:opacity-5 transition-opacity duration-300`} />
          
          <CardHeader className="relative z-10 h-full flex flex-col">
            <motion.div
              className={`
                w-20 h-20 ${feature.iconBg} rounded-3xl 
                flex items-center justify-center mb-6
                shadow-lg
              `}
              animate={{
                scale: isExpanded ? 1.1 : 1,
                rotate: isExpanded ? 360 : 0,
              }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
                rotate: {
                  duration: 0.8,
                  ease: 'easeInOut',
                },
                scale: {
                  duration: 0.3,
                  ease: 'easeOut',
                },
              }}
            >
              <motion.div
                animate={{
                  scale: isExpanded ? 1.05 : 1,
                }}
                transition={{
                  duration: 0.4,
                  delay: isExpanded ? 0.2 : 0,
                  ease: 'easeOut',
                }}
              >
                <feature.icon className={`h-10 w-10 ${feature.iconColor}`} />
              </motion.div>
            </motion.div>

            <CardTitle className="text-gray-900 text-2xl mb-4 font-bold">
              {feature.title}
            </CardTitle>

            <div className="flex-1 flex flex-col">
              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? 'auto' : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.04, 0.62, 0.23, 0.98],
                }}
                className="overflow-hidden"
              >
                <div className="pt-2">
                  <CardDescription className="text-gray-700 leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                  <motion.div
                    initial={false}
                    animate={{
                      scaleX: isExpanded ? 1 : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: isExpanded ? 0.2 : 0,
                      ease: 'easeOut',
                    }}
                    className={`mt-4 h-1 w-16 bg-gradient-to-r ${feature.gradient} rounded-full origin-left`}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={{
                  opacity: isExpanded ? 0 : 1,
                  y: isExpanded ? -10 : 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                className="mt-auto"
              >
                {!isExpanded && (
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    <span>Clique para ver mais</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="text-gray-400"
                    >
                      →
                    </motion.div>
                  </p>
                )}
              </motion.div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  });

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full border border-purple-200 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600 font-semibold text-sm">Funcionalidades Inteligentes</span>
          </motion.div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme seu negócio com{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              tecnologia inteligente
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Descubra como nossas ferramentas revolucionárias podem{' '}
            <span className="font-semibold text-gray-800">acelerar suas vendas</span>,{' '}
            <span className="font-semibold text-gray-800">automatizar processos</span> e{' '}
            <span className="font-semibold text-gray-800">conectar sua equipe</span> de forma nunca vista antes
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Carousel 
            itemsPerSlide={3}
            showDots={true}
            className="w-full"
          >
            {featureCards}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
