from flask import Flask, send_from_directory, render_template, request, make_response, redirect, url_for, flash
from create_file import create_file
import os
import sys

app = Flask(__name__)

basedir = os.path.dirname(__file__)
static_dir = os.path.join(basedir, 'static/')

@app.before_request
def before_app_start():
    create_file()


@app.route('/', methods=['GET'])
def index():
    real_ip = request.headers.get('X-Real-Ip')
    user_agent = request.headers.get('User-Agent')
    if real_ip:
        real_ip = request.headers.get('X-Real-Ip')
        return render_template('index.html', real_ip=real_ip, user_agent=user_agent)
    else:
        return render_template('index.html')


@app.route('/download/<filename>', methods=['GET'])
def download_test(filename):
    try:
        response = make_response(send_from_directory(static_dir, filename))
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response
    except:
        return 'Error.', 404


@app.route('/upload/', methods=['POST'])
def upload_test():
    if request.form:
        upload_data = request.form.get('upload_data')
        if upload_data:
            upload_data = None
    return 'OK', 200


@app.route('/set_filesize/<int:file_size>/', methods=['GET'])
def set_filesize(file_size):
    if file_size >= 10 and file_size <= 1000:
        try:
            if os.path.isfile(os.path.join(static_dir, 'random_data.txt')):
                os.remove(os.path.join(static_dir, 'random_data.txt'))
                create_file(file_size)
                flash('New random data file {:,} Mbytes created.'.format(file_size))
                return redirect(url_for('index'))
        except:
            flash('Error - ', sys.exc_info()[1])
            return redirect(url_for('index'))
            
    else:
        flash('Message: File size must be between 10 (10MB) and 1000 (1GB).')
        return redirect(url_for('index'))
