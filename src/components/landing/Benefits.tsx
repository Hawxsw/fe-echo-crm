import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Zap,
  BarChart3,
  ArrowUpRight,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  'Aumente suas vendas em até 40% com automação inteligente',
  'Reduza tempo de atendimento em 60% com WhatsApp integrado',
  'Controle total do pipeline de vendas em tempo real',
  'Gerencie múltiplas empresas com isolamento completo',
  'Dashboards personalizáveis para tomada de decisão',
  'Segurança empresarial com conformidade LGPD',
  'Interface intuitiva que sua equipe vai adorar usar',
  'Suporte 24/7 para garantir seu sucesso',
];

const highlights = [
  {
    icon: BarChart3,
    title: 'Resultados Comprovados',
    description: 'Empresas que usam nosso CRM aumentam vendas em média 40% e reduzem custos operacionais em 30%. Dados reais, resultados mensuráveis.',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'border-emerald-500/30',
    iconBg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-400/20',
    iconColor: 'text-emerald-500',
    accent: 'from-emerald-500 to-green-500',
  },
  {
    icon: ArrowUpRight,
    title: 'Foco no Cliente',
    description: 'Cada funcionalidade foi pensada para melhorar a experiência do cliente e acelerar o processo de vendas. Menos trabalho, mais resultados.',
    gradient: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'border-blue-500/30',
    iconBg: 'bg-gradient-to-br from-blue-500/20 to-blue-400/20',
    iconColor: 'text-blue-500',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Star,
    title: 'Equipe Produtiva',
    description: 'Interface intuitiva que sua equipe domina em minutos. Menos treinamento, mais produtividade. Sua equipe vai amar trabalhar com nosso CRM.',
    gradient: 'from-purple-500/20 to-purple-500/5',
    borderColor: 'border-purple-500/30',
    iconBg: 'bg-gradient-to-br from-purple-500/20 to-purple-400/20',
    iconColor: 'text-purple-500',
    accent: 'from-purple-500 to-pink-500',
  },
];

export default function Benefits() {
  return (
    <section id="about-us" className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-full border border-green-200 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-semibold text-sm">Resultados Garantidos</span>
          </motion.div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Por que escolher o{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Echo CRM?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Não é apenas mais um CRM. É a{' '}
            <span className="font-semibold text-gray-800">solução completa</span> que{' '}
            <span className="font-semibold text-gray-800">acelera suas vendas</span> e{' '}
            <span className="font-semibold text-gray-800">maximiza seus resultados</span> de forma comprovada
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Benefícios que transformam seu negócio:
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <motion.div 
                    className="w-7 h-7 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 12 }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </motion.div>
                  <span className="text-gray-700 text-base leading-relaxed group-hover:text-gray-900 transition-colors font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + (index * 0.15) }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className={`bg-white/80 backdrop-blur-sm border-2 ${highlight.borderColor} hover:border-${highlight.iconColor.split('-')[1]}-500/50 hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <CardHeader className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 ${highlight.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <highlight.icon className={`h-8 w-8 ${highlight.iconColor}`} />
                      </motion.div>
                    </motion.div>
                    
                    <CardTitle className="text-gray-900 text-2xl mb-4 font-bold group-hover:text-gray-800 transition-colors">
                      {highlight.title}
                    </CardTitle>
                    
                    <CardDescription className="text-gray-600 text-base leading-relaxed group-hover:text-gray-700 transition-colors">
                      {highlight.description}
                    </CardDescription>
                    
                    <motion.div
                      className={`mt-4 h-1 w-0 bg-gradient-to-r ${highlight.accent} rounded-full group-hover:w-16 transition-all duration-500`}
                      whileHover={{ width: 64 }}
                    />
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
