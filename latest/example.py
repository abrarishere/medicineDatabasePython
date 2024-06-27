from flask import Flask

from graphs import main

app = Flask(__name__)

@app.route('/')
def home():
    return main(x=[1, 2, 3], y=[4, 5, 6], type='line')

if __name__ == '__main__':
    app.run(debug=True)
