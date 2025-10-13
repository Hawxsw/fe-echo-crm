import { motion } from 'framer-motion';
import CRMVisualization3D from './CRMVisualization3D';

export default function Hero() {
  return (
    <section id="header" className="relative min-h-screen flex items-center overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-indigo-500/10 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <span className="text-blue-600 font-semibold">✨ CRM de Nova Geração</span>
            </motion.div>

            <motion.h1
              className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-gray-900"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Onde dados se{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">transformam</span> em conexões reais
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Unifique clientes, WhatsApp, projetos e equipe em uma plataforma inteligente. 
              Automação poderosa. Insights em tempo real. Crescimento acelerado.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700 font-medium">Sincronização instantânea</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700 font-medium">WhatsApp nativo</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-700 font-medium">Fluxos visuais</span>
              </div>
            </motion.div>
          </motion.div>

          <CRMVisualization3D />
        </div>
      </div>
    </section>
  );
}
