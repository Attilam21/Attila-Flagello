import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { LoadingSkeletonCard } from '../components/ui/LoadingSkeleton';

const Statistiche = () => {
  const isLoading = false; // Simula loading

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Statistiche</h1>
        <p className="text-muted">Analisi dettagliate delle performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">
              Performance Generale
            </h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSkeletonCard />
            ) : (
              <EmptyState
                icon={BarChart3}
                title="Nessun dato disponibile"
                description="Analizza alcuni match per vedere le statistiche."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">
              Trend Performance
            </h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSkeletonCard />
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="Nessun trend disponibile"
                description="I trend delle performance appariranno qui."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">
              Attività Recente
            </h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSkeletonCard />
            ) : (
              <EmptyState
                icon={Activity}
                title="Nessuna attività"
                description="Le tue attività recenti appariranno qui."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">
            Analisi Dettagliata
          </h3>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={BarChart3}
            title="Nessuna analisi disponibile"
            description="Completa l'analisi di alcuni match per vedere le statistiche dettagliate."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistiche;
