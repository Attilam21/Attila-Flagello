import { UserCheck, Search, Users } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Avversario = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Avversario</h1>
          <p className="text-muted">Analizza le squadre avversarie</p>
        </div>
        <Button>
          <Search className="h-4 w-4 mr-2" />
          Cerca Squadra
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cerca squadra avversaria..."
            className="pl-10"
          />
        </div>
        <Button variant="ghost">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Squadre Analizzate</h3>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Users}
              title="Nessuna squadra analizzata"
              description="Inizia analizzando le squadre avversarie per scoprire le loro caratteristiche."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Confronti</h3>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={UserCheck}
              title="Nessun confronto disponibile"
              description="I confronti con le squadre avversarie appariranno qui."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Analisi Avversari</h3>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={UserCheck}
            title="Nessuna analisi avversaria"
            description="Analizza le squadre avversarie per ottenere insights strategici."
            action={
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Inizia Analisi
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Avversario
