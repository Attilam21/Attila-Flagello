# Attila-Flagello

Progetto operativo per automazione agenti su Cursor.

## Requisiti
- Python >= 3.10

## Setup rapido
```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -e .
pip install pytest
```

## Esecuzione test
```bash
pytest
```

## Struttura
```
src/attila_flagello/  # codice sorgente del pacchetto
tests/                # test
```

## CI
GitHub Actions esegue i test su push e pull request per tutti i branch.
