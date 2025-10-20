import { Home, TrendingUp, Users, Target } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">
          Panoramica generale del tuo eFootballLab
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-gray-400">Squadra</p>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-gray-400">Giocatori in rosa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted">Match</p>
            <Target className="h-4 w-4 text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-muted">Partite analizzate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted">Performance</p>
            <TrendingUp className="h-4 w-4 text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">-</div>
            <p className="text-xs text-muted">Media valutazioni</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted">Stato</p>
            <Badge variant="neutral">Inizializzazione</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0%</div>
            <p className="text-xs text-muted">Completamento setup</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">
            Benvenuto in eFootballLab
          </h3>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Home}
            title="Inizia la tua analisi"
            description="Carica la tua rosa, analizza i match e scopri le statistiche dei tuoi giocatori."
            action={
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-primary-fg rounded-xl text-sm font-medium">
                  Crea Rosa
                </button>
                <button className="px-4 py-2 border border-surface text-muted rounded-xl text-sm font-medium hover:bg-surface">
                  Analizza Match
                </button>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
