from attila_flagello.__main__ import create_app


def test_create_app_smoke():
    app = create_app()
    # Verifica minima: l'app esiste e ha un layout
    assert app is not None
    assert app.layout is not None
