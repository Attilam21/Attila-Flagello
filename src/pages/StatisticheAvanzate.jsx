import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Zap, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Filter,
  Eye,
  Activity,
  Brain,
  Map,
  Network,
  Crosshair,
  Lock,
  Clock,
  Trophy,
  Star,
  ArrowRight,
  Plus,
  Settings
} from 'lucide-react';
import { Card, Button, Badge, EmptyState } from '../components/ui';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { auth } from '../services/firebaseClient';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../services/firebaseClient';

const StatisticheAvanzate = ({ onPageChange }) => {
  // State management
  const [selectedRange, setSelectedRange] = useState('5');
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [user, setUser] = useState(null);
  
  // Firestore data states
  const [matchesData, setMatchesData] = useState([]);
  const [playersData, setPlayersData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  
  // Firestore data loading functions
  const loadMatchesData = async (userId, range) => {
    try {
      const matchesRef = collection(db, 'matches');
      const q = query(
        matchesRef,
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        limit(parseInt(range))
      );
      const querySnapshot = await getDocs(q);
      const matches = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMatchesData(matches);
      return matches;
    } catch (error) {
      console.error('Error loading matches:', error);
      return [];
    }
  };

  const loadPlayersData = async (userId) => {
    try {
      const playersRef = collection(db, 'players');
      const q = query(playersRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const players = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlayersData(players);
      return players;
    } catch (error) {
      console.error('Error loading players:', error);
      return [];
    }
  };

  const loadTasksData = async (userId) => {
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasksData(tasks);
      return tasks;
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  };

  const calculateKPIs = (matches) => {
    if (!matches || matches.length === 0) return {};
    
    const totalMatches = matches.length;
    const totals = matches.reduce((acc, match) => {
      return {
        possession: acc.possession + (match.possession || 0),
        shots: acc.shots + (match.shots || 0),
        shotsOnTarget: acc.shotsOnTarget + (match.shotsOnTarget || 0),
        passAccuracy: acc.passAccuracy + (match.passAccuracy || 0),
        corners: acc.corners + (match.corners || 0),
        fouls: acc.fouls + (match.fouls || 0),
        goalsScored: acc.goalsScored + (match.goalsScored || 0),
        goalsConceded: acc.goalsConceded + (match.goalsConceded || 0)
      };
    }, {
      possession: 0, shots: 0, shotsOnTarget: 0, passAccuracy: 0,
      corners: 0, fouls: 0, goalsScored: 0, goalsConceded: 0
    });

    // Calculate averages and trends
    const averages = {
      possession: Math.round(totals.possession / totalMatches),
      shots: Math.round(totals.shots / totalMatches),
      shotsOnTarget: Math.round(totals.shotsOnTarget / totalMatches),
      passAccuracy: Math.round(totals.passAccuracy / totalMatches),
      corners: Math.round(totals.corners / totalMatches),
      fouls: Math.round(totals.fouls / totalMatches),
      goalsScored: Math.round(totals.goalsScored / totalMatches),
      goalsConceded: Math.round(totals.goalsConceded / totalMatches)
    };

    // Calculate trends (simplified - compare with previous range)
    const trends = {};
    Object.keys(averages).forEach(key => {
      const currentValue = averages[key];
      const previousValue = currentValue * 0.9; // Mock previous value
      const change = Math.round(((currentValue - previousValue) / previousValue) * 100);
      
      trends[key] = {
        value: currentValue,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
        change: Math.abs(change)
      };
    });

    return trends;
  };

  const generateTasksFromAnalysis = (matches, players) => {
    const tasks = [];
    
    if (!matches || matches.length === 0) return tasks;

    // Analyze possession
    const avgPossession = matches.reduce((acc, match) => acc + (match.possession || 0), 0) / matches.length;
    if (avgPossession < 50) {
      tasks.push({
        id: `task-${Date.now()}-1`,
        title: 'Migliora il controllo del possesso palla',
        description: 'La squadra ha una media possesso bassa. Concentrati sulla costruzione del gioco.',
        role: 'Centrocampisti',
        priority: avgPossession < 40 ? 'Alta' : 'Media',
        impact: 'Alto',
        category: 'Tattica'
      });
    }

    // Analyze defensive errors
    const avgGoalsConceded = matches.reduce((acc, match) => acc + (match.goalsConceded || 0), 0) / matches.length;
    if (avgGoalsConceded > 2) {
      tasks.push({
        id: `task-${Date.now()}-2`,
        title: 'Rafforza la fase difensiva',
        description: 'Troppi gol subiti. Migliora la compattezza difensiva.',
        role: 'Difensori',
        priority: avgGoalsConceded > 3 ? 'Alta' : 'Media',
        impact: 'Alto',
        category: 'Difesa'
      });
    }

    // Analyze offensive efficiency
    const avgShots = matches.reduce((acc, match) => acc + (match.shots || 0), 0) / matches.length;
    const avgGoals = matches.reduce((acc, match) => acc + (match.goalsScored || 0), 0) / matches.length;
    const efficiency = avgGoals / avgShots;
    
    if (efficiency < 0.15) {
      tasks.push({
        id: `task-${Date.now()}-3`,
        title: 'Migliora l\'efficacia offensiva',
        description: 'Bassa conversione tiri-gol. Lavora sulla finalizzazione.',
        role: 'Attaccanti',
        priority: efficiency < 0.1 ? 'Alta' : 'Media',
        impact: 'Medio',
        category: 'Attacco'
      });
    }

    return tasks;
  };

  // Load data on component mount and when range changes
  useEffect(() => {
    const loadData = async () => {
      if (!auth.currentUser) return;
      
      setIsLoading(true);
      const userId = auth.currentUser.uid;
      
      try {
        const [matches, players, tasks] = await Promise.all([
          loadMatchesData(userId, selectedRange),
          loadPlayersData(userId),
          loadTasksData(userId)
        ]);

        if (matches.length === 0) {
          setHasData(false);
        } else {
          setHasData(true);
          // Calculate KPIs from real data
          const calculatedKPIs = calculateKPIs(matches);
          setKpiData(calculatedKPIs);
          
          // Generate tasks from analysis
          const generatedTasks = generateTasksFromAnalysis(matches, players);
          setSuggestedTasks(generatedTasks);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setHasData(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedRange]);

  // Mock data - fallback when no real data available
  const [kpiData, setKpiData] = useState({
    possession: { value: 65, trend: 'up', change: 5 },
    shots: { value: 14, trend: 'up', change: 2 },
    shotsOnTarget: { value: 8, trend: 'up', change: 1 },
    passAccuracy: { value: 87, trend: 'up', change: 3 },
    corners: { value: 6, trend: 'down', change: -1 },
    fouls: { value: 12, trend: 'down', change: -2 },
    goalsScored: { value: 3, trend: 'up', change: 1 },
    goalsConceded: { value: 1, trend: 'down', change: -1 }
  });

  const [styleAnalysis, setStyleAnalysis] = useState({
    playStyle: 'Possession-based',
    strengths: ['Controllo palla', 'Passaggi corti', 'Costruzione lenta'],
    weaknesses: ['Finalizzazione', 'Cross', 'Contropiede'],
    radar: {
      possession: 85,
      pressing: 60,
      counterAttack: 45,
      crossing: 35,
      longShots: 25,
      setPieces: 70
    }
  });

  const [squadCoherence, setSquadCoherence] = useState({
    overall: 78,
    departments: {
      defense: { coherence: 85, warnings: 1 },
      midfield: { coherence: 75, warnings: 2 },
      attack: { coherence: 74, warnings: 1 }
    },
    warnings: [
      { player: 'Messi', position: 'RW', issue: 'Fuori ruolo', severity: 'high' },
      { player: 'Ronaldo', position: 'ST', issue: 'Zona scoperta', severity: 'medium' }
    ]
  });

  const [passNetwork, setPassNetwork] = useState({
    totalPasses: 487,
    keyPasses: 23,
    accuracy: 87,
    heatmap: {
      center: 45,
      left: 25,
      right: 30
    }
  });

  const [offensiveDanger, setOffensiveDanger] = useState({
    totalShots: 14,
    shotsOnTarget: 8,
    xG: 2.3,
    shotMap: [
      { zone: 'Area piccola', shots: 4, xG: 1.2 },
      { zone: 'Dischetto', shots: 6, xG: 0.8 },
      { zone: 'Fuori area', shots: 4, xG: 0.3 }
    ]
  });

  const [defensivePhase, setDefensivePhase] = useState({
    recoveries: 23,
    interceptions: 18,
    duels: 45,
    duelWinRate: 67,
    heatmap: {
      highPressing: 35,
      mediumPressing: 45,
      lowPressing: 20
    }
  });

  const [recurringErrors, setRecurringErrors] = useState([
    {
      error: 'Bassa precisione passaggi in uscita',
      frequency: 8,
      trend: 'up',
      lastOccurrence: '2 partite fa',
      impact: 'high'
    },
    {
      error: 'Tiri concessi dal mezzo spazio destro',
      frequency: 6,
      trend: 'down',
      lastOccurrence: '1 partita fa',
      impact: 'medium'
    },
    {
      error: 'Calo dopo il 70\'',
      frequency: 5,
      trend: 'stable',
      lastOccurrence: '3 partite fa',
      impact: 'medium'
    }
  ]);

  const [bestPlayers, setBestPlayers] = useState([
    { name: 'Jude Bellingham', role: 'CC', rating: 8.5, goals: 2, assists: 3, synergy: 92 },
    { name: 'Vinicius Jr.', role: 'COME', rating: 8.2, goals: 1, assists: 2, synergy: 88 },
    { name: 'Luka Modric', role: 'PT', rating: 7.9, goals: 0, assists: 4, synergy: 85 },
    { name: 'Thibaut Courtois', role: 'PT', rating: 7.8, goals: 0, assists: 0, synergy: 82 },
    { name: 'Davide Alaba', role: 'DC', rating: 7.6, goals: 0, assists: 1, synergy: 79 }
  ]);

  const [metaComparison, setMetaComparison] = useState({
    currentFormation: '4-3-3',
    metaFormation: '4-2-3-1',
    currentStyle: 'Possession',
    metaStyle: 'Counter Attack',
    adaptation: 65,
    suggestions: [
      'Considera il modulo 4-2-3-1 per maggiore equilibrio',
      'Adatta lo stile al meta attuale',
      'Rafforza il centrocampo'
    ]
  });

  const [suggestedTasks, setSuggestedTasks] = useState([
    {
      id: 1,
      title: 'Aumenta densità centrale in rifinitura',
      description: 'Migliora la costruzione del gioco attraverso il centro',
      role: 'Centrocampisti',
      priority: 'Alta',
      impact: 'Alto',
      category: 'Tattica'
    },
    {
      id: 2,
      title: 'Riduci errori in uscita di palla',
      description: 'Migliora la precisione dei passaggi dalla difesa',
      role: 'Difensori',
      priority: 'Media',
      impact: 'Alto',
      category: 'Tecnica'
    },
    {
      id: 3,
      title: 'Ottimizza pressing alto',
      description: 'Riduci i recuperi nella metà campo avversaria',
      role: 'Tutti',
      priority: 'Bassa',
      impact: 'Medio',
      category: 'Fisico'
    }
  ]);

  // Handlers
  const handleRangeChange = (range) => {
    setSelectedRange(range);
    // In production: refetch data based on range
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleCreateCounters = () => {
    console.log('Creare contromisure');
  };


  const handleAddTask = async (task) => {
    try {
      if (!auth.currentUser) return;
      
      const userId = auth.currentUser.uid;
      const taskRef = doc(collection(db, 'tasks'));
      
      const taskData = {
        ...task,
        userId,
        createdAt: new Date(),
        status: 'pending',
        source: 'statistiche-avanzate'
      };
      
      await setDoc(taskRef, taskData);
      console.log('Task aggiunto con successo:', task.title);
      
      // Reload tasks
      await loadTasksData(userId);
      
    } catch (error) {
      console.error('Errore nell\'aggiungere il task:', error);
    }
  };

  const handleAddAllTasks = async () => {
    try {
      if (!auth.currentUser) return;
      
      const userId = auth.currentUser.uid;
      
      for (const task of suggestedTasks) {
        const taskRef = doc(collection(db, 'tasks'));
        const taskData = {
          ...task,
          userId,
          createdAt: new Date(),
          status: 'pending',
          source: 'statistiche-avanzate'
        };
        
        await setDoc(taskRef, taskData);
      }
      
      console.log('Tutti i task aggiunti con successo');
      await loadTasksData(userId);
      
    } catch (error) {
      console.error('Errore nell\'aggiungere tutti i task:', error);
    }
  };

  const handlePlayerClick = (player) => {
    console.log('Apri dettagli giocatore:', player);
  };

  // Render functions
  const renderHeader = () => (
    <div className="page-header sticky top-0 z-10 bg-[#0b1223] pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <BarChart3 className="inline-block mr-3" size={32} />
            Statistiche Avanzate
          </h1>
          <p className="text-white/60">
            Analisi dettagliata delle performance della squadra
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">Range:</span>
            <div className="flex bg-white/10 rounded-lg p-1">
              {['5', '10', '30'].map((range) => (
                <button
                  key={range}
                  onClick={() => handleRangeChange(range)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedRange === range
                      ? 'bg-emerald-500 text-[#0b1223]'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  Ultime {range}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCreateCounters}
              className="btn btn-secondary"
            >
              <Shield size={16} />
              Crea contromisure
            </button>
            <button 
              onClick={handleAddAllTasks}
              className="btn btn-primary"
            >
              <Plus size={16} />
              Aggiungi tutti i task
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKPIAdvanced = () => (
    <div className="kpi-section mb-8">
      <div className="section-header mb-6">
        <h2 className="section-title">
          <TrendingUp size={24} />
          KPI Avanzati
        </h2>
        <p className="section-description">
          Indicatori chiave delle ultime {selectedRange} partite
        </p>
      </div>
      <div className="kpi-grid grid grid-cols-4 gap-4">
        {Object.entries(kpiData).map(([key, data]) => (
          <Card key={key} className="kpi-card">
            <div className="kpi-icon">
              <Activity size={24} />
            </div>
            <div className="kpi-value">{data.value}</div>
            <div className="kpi-label">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            <div className={`kpi-trend ${data.trend}`}>
              {data.trend === 'up' ? (
                <TrendingUp size={16} />
              ) : data.trend === 'down' ? (
                <TrendingUp size={16} className="rotate-180" />
              ) : (
                <div className="w-4 h-0.5 bg-white/40"></div>
              )}
              {data.change > 0 ? '+' : ''}{data.change}%
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStyleAnalysis = () => (
    <div className="style-analysis-section mb-8">
      <div className="section-header mb-6">
        <h2 className="section-title">
          <Brain size={24} />
          Analisi Stile
        </h2>
        <p className="section-description">
          Identificazione dello stile di gioco della squadra
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="style-card">
          <h3 className="card-title">Stile di Gioco</h3>
          <div className="style-overview">
            <div className="style-name">{styleAnalysis.playStyle}</div>
            <div className="style-description">
              Approccio basato sul controllo del possesso palla e costruzione del gioco
            </div>
          </div>
          <div className="style-strengths">
            <h4>Punti di Forza</h4>
            <ul>
              {styleAnalysis.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <div className="style-weaknesses">
            <h4>Punti da Migliorare</h4>
            <ul>
              {styleAnalysis.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        </Card>
        <Card className="radar-card">
          <h3 className="card-title">Radar Tattico</h3>
          <div className="radar-chart">
            {/* Placeholder for radar chart */}
            <div className="radar-placeholder">
              <div className="radar-center">
                <div className="radar-axis">Possesso: {styleAnalysis.radar.possession}%</div>
                <div className="radar-axis">Pressing: {styleAnalysis.radar.pressing}%</div>
                <div className="radar-axis">Contropiede: {styleAnalysis.radar.counterAttack}%</div>
                <div className="radar-axis">Cross: {styleAnalysis.radar.crossing}%</div>
                <div className="radar-axis">Tiri da fuori: {styleAnalysis.radar.longShots}%</div>
                <div className="radar-axis">Pali fissi: {styleAnalysis.radar.setPieces}%</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSquadCoherence = () => (
    <div className="coherence-section mb-8">
      <div className="section-header mb-6">
        <h2 className="section-title">
          <Target size={24} />
          Coerenza Rosa
        </h2>
        <p className="section-description">
          Analisi della coerenza tattica e posizionale
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="coherence-card">
          <h3 className="card-title">Mappa Campo</h3>
          <div className="field-map">
            {/* Placeholder for 2D field map */}
            <div className="field-placeholder">
              <div className="field-warnings">
                {squadCoherence.warnings.map((warning, index) => (
                  <div key={index} className={`warning-marker ${warning.severity}`}>
                    {warning.player}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card className="departments-card">
          <h3 className="card-title">Coerenza Reparti</h3>
          <div className="departments-list">
            {Object.entries(squadCoherence.departments).map(([dept, data]) => (
              <div key={dept} className="department-item">
                <div className="department-header">
                  <span className="department-name">{dept}</span>
                  <span className="department-coherence">{data.coherence}%</span>
                </div>
                <div className="department-bar">
                  <div 
                    className="department-fill" 
                    style={{ width: `${data.coherence}%` }}
                  ></div>
                </div>
                {data.warnings > 0 && (
                  <div className="department-warnings">
                    {data.warnings} warning
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderPassNetwork = () => (
    <div className="pass-network-section mb-8">
      <div className="section-header mb-6">
        <h2 className="section-title">
          <Network size={24} />
          Rete Passaggi
        </h2>
        <p className="section-description">
          Analisi della circolazione palla e connessioni
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="network-card">
          <h3 className="card-title">Grafo Passaggi</h3>
          <div className="network-graph">
            {/* Placeholder for network graph */}
            <div className="graph-placeholder">
              <div className="graph-stats">
                <div className="stat-item">
                  <span className="stat-label">Passaggi Totali:</span>
                  <span className="stat-value">{passNetwork.totalPasses}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Passaggi Chiave:</span>
                  <span className="stat-value">{passNetwork.keyPasses}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Precisione:</span>
                  <span className="stat-value">{passNetwork.accuracy}%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="heatmap-card">
          <h3 className="card-title">Heat Imbocchi</h3>
          <div className="heatmap-visualization">
            <div className="heatmap-zones">
              <div className="heatmap-zone center">
                <span>Centro: {passNetwork.heatmap.center}%</span>
              </div>
              <div className="heatmap-zone left">
                <span>Sinistra: {passNetwork.heatmap.left}%</span>
              </div>
              <div className="heatmap-zone right">
                <span>Destra: {passNetwork.heatmap.right}%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderOffensiveDanger = () => (
    <div className="offensive-section mb-8">
      <div className="section-header mb-6">
        <h2 className="section-title">
          <Crosshair size={24} />
          Pericolosità Offensiva
        </h2>
        <p className="section-description">
          Analisi della minaccia offensiva e zone di tiro
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="shotmap-card">
          <h3 className="card-title">Shot Map</h3>
          <div className="shot-map">
            {/* Placeholder for shot map */}
            <div className="shot-map-placeholder">
              <div className="field-outline">
                <div className="goal-area"></div>
                <div className="penalty-area"></div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="xg-card">
          <h3 className="card-title">xG per Zona</h3>
          <div className="xg-bars">
            {offensiveDanger.shotMap.map((zone, index) => (
              <div key={index} className="xg-bar">
                <div className="xg-label">{zone.zone}</div>
                <div className="xg-bar-container">
                  <div 
                    className="xg-bar-fill" 
                    style={{ width: `${(zone.xG / 2.3) * 100}%` }}
                  ></div>
                </div>
                <div className="xg-value">{zone.xG.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderDefensivePhase = () => (
    <div className="defensive-section mb-8">
      <div className="section-header mb-6">
        <h2 className="section-title">
          <Shield size={24} />
          Fase Difensiva
        </h2>
        <p className="section-description">
          Analisi del pressing e recuperi palla
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="heatmap-card">
          <h3 className="card-title">Heat Recuperi</h3>
          <div className="heatmap-defensive">
            {/* Placeholder for defensive heatmap */}
            <div className="heatmap-placeholder">
              <div className="heatmap-stats">
                <div className="heat-stat">
                  <span>Recuperi: {defensivePhase.recoveries}</span>
                </div>
                <div className="heat-stat">
                  <span>Intercetti: {defensivePhase.interceptions}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="duels-card">
          <h3 className="card-title">Duelli e Intercetti</h3>
          <div className="duels-bars">
            <div className="duel-bar">
              <div className="duel-label">Duelli Totali</div>
              <div className="duel-bar-container">
                <div className="duel-bar-fill" style={{ width: '100%' }}></div>
              </div>
              <div className="duel-value">{defensivePhase.duels}</div>
            </div>
            <div className="duel-bar">
              <div className="duel-label">% Vittoria Duelli</div>
              <div className="duel-bar-container">
                <div 
                  className="duel-bar-fill" 
                  style={{ width: `${defensivePhase.duelWinRate}%` }}
                ></div>
              </div>
              <div className="duel-value">{defensivePhase.duelWinRate}%</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderRecurringErrors = () => (
    <div className="errors-section mb-8">
      <div className="section-header mb-6">
        <h2 className="section-title">
          <AlertCircle size={24} />
          Errori Ricorrenti
        </h2>
        <p className="section-description">
          Top 3 errori più frequenti con timeline disciplina
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="errors-card">
          <h3 className="card-title">Top 3 Errori</h3>
          <div className="errors-list">
            {recurringErrors.map((error, index) => (
              <div key={index} className="error-item">
                <div className="error-rank">#{index + 1}</div>
                <div className="error-content">
                  <div className="error-title">{error.error}</div>
                  <div className="error-meta">
                    <span className="error-frequency">{error.frequency} volte</span>
                    <span className="error-last">{error.lastOccurrence}</span>
                  </div>
                  <div className={`error-impact ${error.impact}`}>
                    Impatto: {error.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="timeline-card">
          <h3 className="card-title">Timeline Disciplina</h3>
          <div className="timeline-visualization">
            {/* Placeholder for timeline */}
            <div className="timeline-placeholder">
              <div className="timeline-item">Partita 1: 2 errori</div>
              <div className="timeline-item">Partita 2: 4 errori</div>
              <div className="timeline-item">Partita 3: 1 errore</div>
              <div className="timeline-item">Partita 4: 3 errori</div>
              <div className="timeline-item">Partita 5: 2 errori</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderBestPlayers = () => (
    <div className="players-section mb-8">
      <div className="section-header mb-6">
        <h2 className="section-title">
          <Users size={24} />
          Migliori Giocatori
        </h2>
        <p className="section-description">
          Classifica con sinergie e performance
        </p>
      </div>
      <Card className="players-table-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Giocatore</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Gol</TableHead>
              <TableHead>Assist</TableHead>
              <TableHead>Sinergia</TableHead>
              <TableHead>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bestPlayers.map((player, index) => (
              <TableRow key={index} className="player-row">
                <TableCell>
                  <div className="player-info">
                    <span className="player-name">{player.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{player.role}</Badge>
                </TableCell>
                <TableCell>
                  <span className="rating-value">{player.rating}</span>
                </TableCell>
                <TableCell>{player.goals}</TableCell>
                <TableCell>{player.assists}</TableCell>
                <TableCell>
                  <div className="synergy-bar">
                    <div 
                      className="synergy-fill" 
                      style={{ width: `${player.synergy}%` }}
                    ></div>
                    <span className="synergy-text">{player.synergy}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <button 
                    onClick={() => handlePlayerClick(player)}
                    className="btn btn-sm btn-ghost"
                  >
                    <Eye size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  const renderMetaComparison = () => (
    <div className="meta-section mb-8">
      <div className="section-header mb-6">
        <h2 className="section-title">
          <Trophy size={24} />
          Confronto Meta
        </h2>
        <p className="section-description">
          Analisi rispetto al meta attuale del gioco
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="meta-card">
          <h3 className="card-title">Confronto Moduli</h3>
          <div className="formation-comparison">
            <div className="formation-current">
              <div className="formation-label">Attuale</div>
              <div className="formation-name">{metaComparison.currentFormation}</div>
            </div>
            <div className="formation-vs">VS</div>
            <div className="formation-meta">
              <div className="formation-label">Meta</div>
              <div className="formation-name">{metaComparison.metaFormation}</div>
            </div>
          </div>
        </Card>
        <Card className="suggestions-card">
          <h3 className="card-title">Suggerimenti</h3>
          <div className="suggestions-list">
            {metaComparison.suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <CheckCircle size={16} className="suggestion-icon" />
                <span className="suggestion-text">{suggestion}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSuggestedTasks = () => (
    <div className="tasks-section mb-8">
      <div className="section-header mb-6">
        <h2 className="section-title">
          <Star size={24} />
          Task Suggeriti
        </h2>
        <p className="section-description">
          Task generati automaticamente dall'analisi
        </p>
      </div>
      <div className="tasks-list">
        {suggestedTasks.map((task) => (
          <Card key={task.id} className="task-card">
            <div className="task-header">
              <div className="task-priority">
                <Badge 
                  variant={
                    task.priority === 'Alta' ? 'danger' : 
                    task.priority === 'Media' ? 'warning' : 
                    'secondary'
                  }
                >
                  {task.priority}
                </Badge>
                <Badge variant="primary">{task.impact}</Badge>
                <Badge variant="neutral">{task.category}</Badge>
              </div>
            </div>
            <div className="task-content">
              <h4 className="task-title">{task.title}</h4>
              <p className="task-description">{task.description}</p>
              <div className="task-meta">
                <span className="task-role">Ruolo: {task.role}</span>
              </div>
            </div>
            <div className="task-actions">
              <button 
                onClick={() => handleAddTask(task)}
                className="btn btn-primary btn-sm"
              >
                <CheckCircle size={16} />
                Aggiungi ai miei Task
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Main render
  if (!hasData) {
    return (
      <div className="statistiche-page">
        {renderHeader()}
        <div className="page-content">
          <EmptyState
            icon={BarChart3}
            title="Nessun dato disponibile"
            description="Carica almeno una partita per visualizzare le statistiche avanzate"
            action={
              <button 
                onClick={() => onPageChange('carica-partita')}
                className="btn btn-primary"
              >
                <ArrowRight size={16} />
                Carica Ultima Partita
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="statistiche-page">
      {renderHeader()}
      <div className="page-content">
        {renderKPIAdvanced()}
        {renderStyleAnalysis()}
        {renderSquadCoherence()}
        {renderPassNetwork()}
        {renderOffensiveDanger()}
        {renderDefensivePhase()}
        {renderRecurringErrors()}
        {renderBestPlayers()}
        {renderMetaComparison()}
        {renderSuggestedTasks()}
      </div>
    </div>
  );
};

export default StatisticheAvanzate;
