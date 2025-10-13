import {
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Youtube,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const footerLinks = {
  empresa: [
    { name: 'Sobre Nós', href: '#' },
    { name: 'Nossa História', href: '#' },
    { name: 'Trabalhe Conosco', href: '#' },
    { name: 'Imprensa', href: '#' },
  ],
  produtos: [
    { name: 'CRM', href: '#' },
    { name: 'Analytics', href: '#' },
    { name: 'Integrações', href: '#' },
    { name: 'API', href: '#' },
  ],
  suporte: [
    { name: 'Central de Ajuda', href: '#' },
    { name: 'Documentação', href: '#' },
    { name: 'Status', href: '#' },
    { name: 'Contato', href: '#' },
  ],
  legal: [
    { name: 'Termos de Uso', href: '#' },
    { name: 'Política de Privacidade', href: '#' },
    { name: 'Cookies', href: '#' },
    { name: 'LGPD', href: '#' },
  ],
};

const socialLinks = [
  { Icon: Instagram, label: 'Instagram', gradient: 'from-pink-500 to-purple-500' },
  { Icon: Linkedin, label: 'LinkedIn', gradient: 'from-blue-600 to-blue-700' },
  { Icon: Facebook, label: 'Facebook', gradient: 'from-blue-500 to-indigo-600' },
  { Icon: Twitter, label: 'Twitter', gradient: 'from-cyan-400 to-blue-500' },
  { Icon: Youtube, label: 'YouTube', gradient: 'from-red-500 to-red-600' },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.05),transparent_50%)]" />
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative border-t border-gray-200/50">
        <div className="container mx-auto px-4 py-16 border-b border-gray-200/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-semibold text-sm">Fique por dentro</span>
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Receba insights e novidades{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                toda semana
              </span>
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Estratégias de vendas, atualizações de produto e dicas exclusivas direto no seu e-mail
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 px-6 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm transition-all duration-200"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                Inscrever
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Logo variant="footer" animated={false} />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                  Transforme relacionamentos em resultados. Tecnologia inteligente que une equipes, 
                  automatiza processos e acelera crescimento.
                </p>
                <div className="flex gap-3">
                  {socialLinks.map(({ Icon, label, gradient }, index) => (
                    <motion.a
                      key={label}
                      href="#"
                      aria-label={label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative"
                    >
                      <div className="w-11 h-11 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:border-transparent shadow-sm hover:shadow-lg">
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <Icon className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300 relative z-10" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
              >
                <h3 className="text-gray-900 font-bold text-base mb-5 capitalize tracking-wide">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={linkIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (categoryIndex * 0.1) + (linkIndex * 0.05), duration: 0.4 }}
                    >
                      <a
                        href={link.href}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 inline-flex items-center gap-2 group"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="border-t border-gray-200/70 pt-8"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-2 text-sm">
                <p className="text-gray-500">
                  &copy; {new Date().getFullYear()} Echo CRM. Todos os direitos reservados.
                </p>
                <span className="hidden sm:inline text-gray-400">•</span>
                <p className="text-gray-500">
                  Desenvolvido por{' '}
                  <motion.a
                    href="https://github.com/Hawxsw"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Hawxsw
                  </motion.a>
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>São Paulo, SP</span>
                </motion.div>
                <motion.a
                  href="tel:+551199999999"
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <span>(11) 9999-9999</span>
                </motion.a>
                <motion.a
                  href="mailto:contato@echo.com"
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>contato@echo.com</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
