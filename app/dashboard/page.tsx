'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/stores/useStore';
import { getPresentations, createPresentation, deletePresentation, startLiveSession } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Play, Edit, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { presentations, setPresentations } = useStore();
  const [loading, setLoading] = useState(true);
  const [newPresentationTitle, setNewPresentationTitle] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadPresentations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPresentations = async () => {
    try {
      const data = await getPresentations();
      setPresentations(data);
    } catch (error) {
      console.error('Error loading presentations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePresentation = async () => {
    if (!newPresentationTitle.trim()) return;

    setIsCreating(true);
    try {
      const newPresentation = await createPresentation(newPresentationTitle);
      setPresentations([...presentations, newPresentation]);
      setNewPresentationTitle('');
      setIsCreateDialogOpen(false);
      router.push(`/presentation/edit/${newPresentation.id}`);
    } catch (error) {
      console.error('Error creating presentation:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePresentation = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta apresentação?')) return;

    try {
      await deletePresentation(id);
      setPresentations(presentations.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting presentation:', error);
    }
  };

  const handleStartLiveSession = async (presentationId: string) => {
    try {
      const session = await startLiveSession(presentationId);
      router.push(`/live/${session.roomCode}`);
    } catch (error) {
      console.error('Error starting live session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header with better spacing */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Teachy
            </h1>
            <p className="text-lg text-muted-foreground">
              Gerencie suas apresentações interativas
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
                <PlusCircle className="mr-2 h-5 w-5" />
                Nova Apresentação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Apresentação</DialogTitle>
                <DialogDescription>
                  Dê um título à sua apresentação. Você poderá adicionar perguntas depois.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título da Apresentação</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Quiz de Conhecimentos Gerais"
                    value={newPresentationTitle}
                    onChange={(e) => setNewPresentationTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreatePresentation();
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreatePresentation}
                  disabled={!newPresentationTitle.trim() || isCreating}
                >
                  {isCreating ? 'Criando...' : 'Criar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {presentations.length === 0 ? (
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="text-center space-y-4 py-16">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <PlusCircle className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Nenhuma apresentação ainda</CardTitle>
              <CardDescription className="text-base">
                Comece criando sua primeira apresentação interativa
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-16">
              <Button
                size="lg"
                onClick={() => setIsCreateDialogOpen(true)}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Criar Primeira Apresentação
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {presentations.map((presentation) => (
              <Card
                key={presentation.id}
                className="group flex flex-col hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
              >
                <CardHeader className="space-y-3 pb-4">
                  <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                    {presentation.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {presentation.questions.length}{' '}
                      {presentation.questions.length === 1 ? 'pergunta' : 'perguntas'}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/40" />
                    {new Date(presentation.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/presentation/edit/${presentation.id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStartLiveSession(presentation.id)}
                    disabled={presentation.questions.length === 0}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDeletePresentation(presentation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
