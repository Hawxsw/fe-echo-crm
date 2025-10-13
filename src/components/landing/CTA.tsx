import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Rocket, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section id="cta" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/40 to-indigo-50/60">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[size:40px_40px]" />
      </div>

      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/15 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-semibold text-sm">Comece Agora</span>
            </div>
          </motion.div>

          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl group-hover:shadow-3xl transition-shadow duration-300" />
            
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-indigo-500/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            
            <div className="relative p-12 lg:p-16 text-center">
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl mb-8 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Rocket className="w-10 h-10 text-blue-600" strokeWidth={2} />
              </motion.div>

              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Pronto para{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  revolucionar
                </span>
                <br />
                sua gestão?
              </h2>
              
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Junte-se a <span className="font-semibold text-gray-900">centenas de empresas</span> que já{' '}
                <span className="font-semibold text-gray-900">transformaram seus resultados</span> e{' '}
                <span className="font-semibold text-gray-900">aumentaram suas vendas</span>
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-10 py-7 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 font-semibold group/button"
                >
                  Acessar Plataforma
                  <ArrowRight className="h-5 w-5 ml-2 group-hover/button:translate-x-1 transition-transform duration-200" />
                </Button>
              </motion.div>

              <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300" />
                  <span>Configuração em minutos</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-700" />
                  <span>Suporte 24/7</span>
                </div>
              </div>

              <motion.div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "50%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
