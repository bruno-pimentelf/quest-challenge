'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Presentation, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
            Teachy
          </h1>
          <p className="text-2xl text-muted-foreground">
            Apresentações Interativas em Tempo Real
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card
            className="border-2 hover:border-primary/50 hover:shadow-2xl transition-all cursor-pointer group"
            onClick={() => router.push('/dashboard')}
          >
            <CardHeader className="text-center pb-8 pt-12">
              <div className="mx-auto mb-6 relative">
                <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                  <Presentation className="h-14 w-14 text-white" />
                </div>
                <div className="absolute inset-0 h-28 w-28 mx-auto rounded-full bg-primary/20 blur-xl group-hover:blur-2xl transition-all" />
              </div>
              <CardTitle className="text-3xl mb-3 group-hover:text-primary transition-colors">
                Sou Professor
              </CardTitle>
              <CardDescription className="text-lg">
                Crie e apresente questionários interativos
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <Button
                size="lg"
                className="w-full shadow-lg hover:shadow-xl transition-all text-lg h-14"
              >
                <Presentation className="mr-2 h-6 w-6" />
                Acessar Dashboard
              </Button>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground text-center">
                <p>• Criar apresentações</p>
                <p>• Gerenciar perguntas</p>
                <p>• Ver resultados em tempo real</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-2 hover:border-primary/50 hover:shadow-2xl transition-all cursor-pointer group"
            onClick={() => router.push('/join')}
          >
            <CardHeader className="text-center pb-8 pt-12">
              <div className="mx-auto mb-6 relative">
                <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                  <Users className="h-14 w-14 text-white" />
                </div>
                <div className="absolute inset-0 h-28 w-28 mx-auto rounded-full bg-purple-500/20 blur-xl group-hover:blur-2xl transition-all" />
              </div>
              <CardTitle className="text-3xl mb-3 group-hover:text-primary transition-colors">
                Sou Aluno
              </CardTitle>
              <CardDescription className="text-lg">
                Entre em uma sala com o código fornecido
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <Button
                size="lg"
                className="w-full shadow-lg hover:shadow-xl transition-all text-lg h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Users className="mr-2 h-6 w-6" />
                Entrar em uma Sala
              </Button>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground text-center">
                <p>• Digite o código da sala</p>
                <p>• Responda as perguntas</p>
                <p>• Veja os resultados ao vivo</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Plataforma de apresentações interativas para educação
          </p>
        </div>
      </div>
    </div>
  );
}
