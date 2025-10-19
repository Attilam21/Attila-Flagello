from __future__ import annotations

from dash import Dash, html


def create_app() -> Dash:
    app = Dash(__name__)
    app.layout = html.Div([
        html.H1("Attila-Flagello Dashboard"),
        html.P("Benvenuto! Questa è una dash minimale funzionante."),
    ])
    return app


def main() -> None:
    app = create_app()
    # host 0.0.0.0 per compatibilità container/VM
    app.run_server(host="0.0.0.0", port=8050, debug=False)


if __name__ == "__main__":
    main()
