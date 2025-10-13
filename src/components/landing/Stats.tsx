import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Users, TrendingUp, Zap, Award, LucideIcon, BarChart3 } from 'lucide-react';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
  sublabel: string;
  color: string;
  bgColor: string;
  iconBg: string;
  Icon: LucideIcon;
}

const stats: Stat[] = [
  { 
    value: 10000, 
    suffix: '+',
    label: 'Clientes Ativos', 
    sublabel: 'Centralizados na plataforma',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    iconBg: 'bg-blue-100',
    Icon: Users
  },
  { 
    value: 95, 
    suffix: '%',
    label: 'Taxa de Satisfação', 
    sublabel: 'NPS médio dos usuários',
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    iconBg: 'bg-green-100',
    Icon: Award
  },
  { 
    value: 2, 
    suffix: 'min',
    label: 'Tempo de Resposta', 
    sublabel: 'Atendimento via WhatsApp',
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
    iconBg: 'bg-purple-100',
    Icon: Zap
  },
  { 
    value: 85, 
    suffix: '%',
    label: 'Aumento em Vendas', 
    sublabel: 'Conversão de leads qualificados',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-500',
    iconBg: 'bg-cyan-100',
    Icon: TrendingUp
  },
];

function Counter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [motionValue, value, duration, isInView]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toString();
      }
    });
    return () => unsubscribe();
  }, [rounded]);

  return (
    <span className="inline-flex items-baseline">
      <span ref={ref}>0</span>
      <span className="ml-0.5">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[size:40px_40px]" />
      </div>

      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-semibold text-sm">Impacto Mensurável</span>
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Números que <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">impulsionam negócios</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Métricas reais de empresas que transformaram seu atendimento e vendas com nossa plataforma
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.15, duration: 0.5, type: "spring" }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300" />
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor}/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
              
              <div className="relative p-6 lg:p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <motion.div 
                  className={`${stat.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}
                  whileHover={{ rotate: 12, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <stat.Icon className={`w-8 h-8 ${stat.color}`} strokeWidth={2.5} />
                </motion.div>
                
                <div className={`text-5xl lg:text-6xl font-bold ${stat.color} mb-3 tabular-nums`}>
                  <Counter value={stat.value} suffix={stat.suffix} duration={2 + index * 0.2} />
                </div>
                
                <div className="text-gray-900 text-lg font-semibold mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-500 text-sm font-medium">
                  {stat.sublabel}
                </div>

                <motion.div 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 ${stat.bgColor} rounded-full`}
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.5, duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
