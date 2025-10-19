import { useEffect, useMemo, useState } from 'react'
import { Home, TrendingUp, Users, Target, FileText, Clock } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { db } from '../services/firebaseClient'
import { doc, onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore'

const Dashboard = ({ user }) => {
  const [matchMeta, setMatchMeta] = useState(null)
  const [latestOCR, setLatestOCR] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setMatchMeta(null)
      setLatestOCR(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const matchRef = doc(db, 'matches', user.uid)
    const unsubscribeMatch = onSnapshot(matchRef, (snap) => {
      setMatchMeta(snap.exists() ? snap.data() : null)
    })

    const ocrRef = collection(db, 'matches', user.uid, 'ocr')
    const q = query(ocrRef, orderBy('updatedAt', 'desc'), limit(1))
    const unsubscribeOCR = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLatestOCR(snapshot.docs[0].data())
      } else {
        setLatestOCR(null)
      }
      setIsLoading(false)
    })

    return () => {
      unsubscribeMatch()
      unsubscribeOCR()
    }
  }, [user?.uid])

  const kpi = useMemo(() => {
    if (!latestOCR || !latestOCR.text) {
      return { avgRating: '-', matchesAnalyzed: matchMeta ? 1 : 0 }
    }
    // Heuristic: count occurrences of a rating-like pattern 6.0-9.9
    const ratings = (latestOCR.text.match(/(?:^|\s)([6-9](?:\.[0-9])?)(?=\s|$)/g) || [])
      .map((s) => parseFloat(s))
      .filter((v) => v >= 6 && v <= 10)

    if (ratings.length === 0) {
      return { avgRating: '-', matchesAnalyzed: matchMeta ? 1 : 0 }
    }

    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length
    return { avgRating: avg.toFixed(2), matchesAnalyzed: matchMeta ? 1 : 0 }
  }, [latestOCR, matchMeta])

  const lastUpdateText = useMemo(() => {
    const ts = latestOCR?.updatedAt
    if (!ts) return 'Mai'
    // Firestore Timestamp or ISO string
    try {
      const date = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts)
      return date.toLocaleString()
    } catch {
      return 'N/D'
    }
  }, [latestOCR?.updatedAt])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-muted">Panoramica generale del tuo eFootballLab</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted">Squadra</p>
            <Users className="h-4 w-4 text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-muted">Giocatori in rosa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted">Match</p>
            <Target className="h-4 w-4 text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{kpi.matchesAnalyzed}</div>
            <p className="text-xs text-muted">Partite analizzate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted">Performance</p>
            <TrendingUp className="h-4 w-4 text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{kpi.avgRating}</div>
            <p className="text-xs text-muted">Media valutazioni (ultimo OCR)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-muted">Stato</p>
            <Badge variant={latestOCR?.status === 'done' ? 'success' : latestOCR?.status === 'processing' ? 'warn' : latestOCR?.status === 'error' ? 'error' : 'neutral'}>
              {latestOCR?.status ? latestOCR.status : 'Inizializzazione'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted" />
              <span className="text-base">{lastUpdateText}</span>
            </div>
            <p className="text-xs text-muted">Ultimo aggiornamento OCR</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Benvenuto in eFootballLab</h3>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <EmptyState
              icon={Home}
              title="Caricamento dati..."
              description="Recupero dell'ultimo match e KPI in corso."
            />
          ) : matchMeta || latestOCR ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-semibold text-white mb-2">Ultimo Match</h4>
                <div className="rounded-xl border border-surface p-4 bg-surface">
                  <div className="text-sm text-muted mb-2">File</div>
                  <div className="text-white break-all text-sm">{matchMeta?.fileName || matchMeta?.filePath || 'N/D'}</div>
                  <div className="mt-3 text-sm text-muted">Stato:</div>
                  <div className="mt-1">
                    <Badge variant={latestOCR?.status === 'done' ? 'success' : latestOCR?.status === 'processing' ? 'warn' : latestOCR?.status === 'error' ? 'error' : 'neutral'}>
                      {latestOCR?.status || matchMeta?.status || 'N/D'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold text-white mb-2">Estratto OCR</h4>
                <div className="rounded-xl border border-surface p-4 bg-surface">
                  {latestOCR?.text ? (
                    <pre className="text-xs text-muted whitespace-pre-wrap max-h-64 overflow-auto border border-surface rounded-md p-3">
{latestOCR.text.slice(0, 600)}{latestOCR.text.length > 600 ? '\n…' : ''}
                    </pre>
                  ) : (
                    <EmptyState
                      icon={FileText}
                      title="Nessun testo OCR disponibile"
                      description="Carica uno screenshot per popolare i risultati."
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Home}
              title="Inizia la tua analisi"
              description="Carica la tua rosa, analizza i match e scopri le statistiche dei tuoi giocatori."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
