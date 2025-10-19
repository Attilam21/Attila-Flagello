import { Users, Plus, Search } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Rosa = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Rosa</h1>
          <p className="text-muted">Gestisci la tua squadra</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Giocatore
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cerca giocatori..."
            className="pl-10"
          />
        </div>
        <Button variant="ghost">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent>
          <EmptyState
            icon={Users}
            title="Nessun giocatore in rosa"
            description="Inizia aggiungendo i tuoi giocatori per analizzare le loro performance."
            action={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Primo Giocatore
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Rosa
