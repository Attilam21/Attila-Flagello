# Attila-Flagello
Progetto operativo per automazione agenti su Cursor

## 🤖 Agent Management System

Un sistema completo per la gestione e automazione di agenti AI con interfaccia web, comunicazione inter-agente, monitoraggio e logging avanzato.

### Caratteristiche Principali

- **Gestione Agenti**: Creazione, avvio, arresto e riavvio di agenti
- **Tipi di Agenti**: Generale, Coding, Research, Automation, Monitoring, Communication
- **Comunicazione**: Sistema di messaggistica e eventi tra agenti
- **Monitoraggio**: Health checks, metriche di performance, statistiche
- **Interfaccia Web**: Dashboard per monitoraggio e controllo in tempo reale
- **Logging Avanzato**: Sistema di logging strutturato con rotazione file
- **Task Management**: Coda di task con priorità e scheduling

### Struttura del Progetto

```
├── agent_manager.py          # Sistema principale di gestione agenti
├── agent_communication.py   # Sistema di comunicazione inter-agente
├── agent_logging.py         # Sistema di logging avanzato
├── web_interface.py         # Interfaccia web Flask
├── example_usage.py         # Esempi di utilizzo
├── requirements.txt         # Dipendenze Python
└── README.md               # Questo file
```

### Installazione

1. Installa le dipendenze:
```bash
pip install -r requirements.txt
```

2. Esegui l'esempio:
```bash
python example_usage.py
```

3. Avvia l'interfaccia web:
```bash
python web_interface.py
```

4. Apri il browser su: http://localhost:5000

### Utilizzo

#### Creazione di Agenti

```python
from agent_manager import AgentManager, AgentConfig, AgentType, GeneralAgent

# Crea un agente generale
config = AgentConfig(
    name="MyAgent",
    agent_type=AgentType.GENERAL,
    max_concurrent_tasks=5
)
agent = GeneralAgent(config)
```

#### Gestione Task

```python
from agent_manager import AgentTask

# Crea un task
task = AgentTask(
    id="task-1",
    agent_id="",
    task_type="echo",
    payload={"message": "Hello World"}
)

# Invia il task al sistema
await agent_manager.submit_task(task)
```

#### Comunicazione tra Agenti

```python
from agent_communication import AgentCommunicationHub, MessageType

# Invia un messaggio broadcast
await hub.broadcast_message(
    "agent-1",
    MessageType.STATUS_UPDATE,
    {"status": "running"}
)
```

### API Web

- `GET /api/status` - Stato del sistema
- `GET /api/agents` - Lista agenti
- `POST /api/agents/{id}/start` - Avvia agente
- `POST /api/agents/{id}/stop` - Ferma agente
- `POST /api/agents/{id}/restart` - Riavvia agente
- `GET /api/tasks` - Lista task
- `POST /api/tasks` - Crea nuovo task

### Logging

Il sistema include logging avanzato con:
- Rotazione automatica dei file
- Categorizzazione dei log (system, agent, task, communication, health, performance)
- Monitoraggio in tempo reale
- Analisi e metriche

### Monitoraggio

- Health checks automatici
- Metriche di performance
- Statistiche di utilizzo
- Alerting per problemi di salute

### Estensibilità

Il sistema è progettato per essere facilmente estendibile:
- Nuovi tipi di agenti
- Handler personalizzati per messaggi ed eventi
- Plugin per funzionalità aggiuntive
- Integrazione con sistemi esterni