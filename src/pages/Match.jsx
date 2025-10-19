import { Target, Upload, FileText } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const Match = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Match</h1>
          <p className="text-muted">Analizza le partite con OCR</p>
        </div>
        <Badge variant="success">OCR Attivo</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Carica Screenshot</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-surface rounded-xl p-6 text-center">
                <Upload className="h-8 w-8 text-muted mx-auto mb-2" />
                <p className="text-sm text-muted">Trascina qui l'immagine del tabellino</p>
                <p className="text-xs text-muted mt-1">PNG, JPG fino a 10MB</p>
              </div>
              <Button className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Seleziona File
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Risultati OCR</h3>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={FileText}
              title="Nessun match analizzato"
              description="Carica uno screenshot del tabellino per iniziare l'analisi OCR."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Storico Match</h3>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Target}
            title="Nessun match analizzato"
            description="I tuoi match analizzati appariranno qui."
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Match