'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export default function JoinPage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleJoinRoom = () => {
    const code = roomCode.trim().toUpperCase();

    if (!code) {
      setError('Por favor, insira um código de sala');
      return;
    }

    if (code.length !== 6) {
      setError('O código deve ter 6 caracteres');
      return;
    }

    setError('');
    router.push(`/room/${code}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 space-y-4">
          <div className="mx-auto mb-6 relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <LogIn className="h-12 w-12 text-white" />
            </div>
            <div className="absolute inset-0 h-24 w-24 mx-auto rounded-full bg-primary/20 blur-xl" />
          </div>
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
            Teachy
          </h1>
          <p className="text-xl text-muted-foreground">
            Entre em uma sala interativa
          </p>
        </div>

        <Card className="shadow-2xl border-2 hover:border-primary/30 transition-colors">
          <CardHeader className="space-y-2 pb-8">
            <CardTitle className="text-2xl text-center">Código da Sala</CardTitle>
            <CardDescription className="text-center text-base">
              Digite o código de 6 caracteres fornecido pelo professor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Input
                id="room-code"
                type="text"
                placeholder="ABC123"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                className={`text-center text-4xl font-mono tracking-[0.5em] h-20 border-4 focus:border-primary transition-all ${
                  error ? 'border-destructive' : ''
                }`}
                maxLength={6}
                autoFocus
              />
              {error && (
                <div className="bg-destructive/10 border-2 border-destructive/50 rounded-lg p-4">
                  <p className="text-sm text-destructive text-center font-medium">{error}</p>
                </div>
              )}
            </div>

            <Button
              onClick={handleJoinRoom}
              className="w-full shadow-lg hover:shadow-xl transition-all"
              size="lg"
              disabled={!roomCode.trim()}
            >
              <LogIn className="mr-2 h-6 w-6" />
              <span className="text-lg">Entrar na Sala</span>
            </Button>

            <div className="text-center pt-4">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-primary/60" />
                Aguardando código do professor
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
