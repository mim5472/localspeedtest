import os

basedir = os.path.dirname(__file__)
static_dir = os.path.join(basedir, 'static/')

def create_file(file_size=75):
    if os.path.isfile(os.path.join(static_dir, 'random_data.txt')):
        pass
    else:
        with open(os.path.join(static_dir, 'random_data.txt'), 'w') as file:
            size = file_size
            file.write('0' * size * 1024 * 1024)
    return True