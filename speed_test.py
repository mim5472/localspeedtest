from app import app
from waitress import serve


if __name__ == '__main__':
    # app.run(host='localhost', port=5502, debug=True)
    serve(app, host='localhost', port=5502)