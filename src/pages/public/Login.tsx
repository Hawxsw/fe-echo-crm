import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Zap, ArrowLeft, Mail, Lock, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginSchema } from '@/schemas';
import LoginVisualization3D from '@/components/auth/LoginVisualization3D';
import { AxiosError } from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const { login, currentUser, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && token) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, token, navigate]);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = useCallback(
    async (data: LoginSchema) => {
      setIsLoading(true);
      try {
        await login({
          email: data.email,
          password: data.password,
        });
        toast.success('Login realizado com sucesso!');

      } catch (error) {
        if (error instanceof AxiosError) {
          const message = error.response?.data?.message || 'Senha ou e-mail inválido';
          toast.error(message);
        } else {
          toast.error('Erro ao fazer login. Verifique suas credenciais.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [login],
  );


  if (currentUser && token) {
    return null;
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-400/20 blur-3xl"
        />
      </div>

      <div className="relative z-10 flex w-full flex-col justify-center px-4 py-6 sm:px-6 lg:w-1/2 lg:px-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="group mb-4 gap-2 hover:bg-white/50 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Voltar
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="relative">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                      "0 0 30px rgba(99, 102, 241, 0.4)",
                      "0 0 20px rgba(59, 130, 246, 0.3)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-2"
                >
                  <Zap className="h-5 w-5 text-white" />
                </motion.div>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
                Echo CRM
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Acesse sua conta e gerencie seu negócio
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-slate-200/60 bg-white/80 shadow-xl backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl font-bold">Entrar na conta</CardTitle>
                <CardDescription className="text-sm">
                  Digite suas credenciais para continuar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(handleLogin)();
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                        focusedField === 'email' ? 'text-blue-600' : 'text-slate-400'
                      }`} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        {...registerField('email')}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        disabled={isLoading}
                        className="pl-10 h-11 border-slate-200 bg-white transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-red-500 text-sm">{errors.email.message}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                        focusedField === 'password' ? 'text-blue-600' : 'text-slate-400'
                      }`} />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        {...registerField('password')}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        disabled={isLoading}
                        className="pl-10 h-11 border-slate-200 bg-white transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    {errors.password && (
                      <span className="text-red-500 text-sm">{errors.password.message}</span>
                    )}
                  </div>

                  <Button 
                    type="submit"
                    className="h-11 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </motion.div>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Entrar na plataforma
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </form>

                <div className="mt-4 space-y-2 text-center">
                  <button
                    type="button"
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                    onClick={() => toast.info('Funcionalidade em desenvolvimento')}
                  >
                    Esqueceu a senha?
                  </button>
                  <p className="text-sm text-slate-600">
                    Não tem uma conta?{' '}
                    <button
                      type="button"
                      className="font-medium text-blue-600 transition-colors hover:text-indigo-600"
                      onClick={() => navigate('/register')}
                    >
                      Criar conta
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600"
            >
              <Shield className="h-4 w-4" />
              <span>Acesso seguro e criptografado</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>

          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 h-24 w-24 rounded-2xl bg-white/10 backdrop-blur-sm"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-24 h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm"
          />

          <div className="relative z-10 h-full">
            <LoginVisualization3D />
          </div>
        </div>
      </div>
    </div>
  );
}

