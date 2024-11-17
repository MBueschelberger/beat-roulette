"""Router utils"""

import os
from src.settings import settings

def list_files():
    return os.listdir(settings.file_directory)

def get_file(file_name):
    if file_name in list_files():
        file_path = os.path.join(settings.file_directory, file_name)
    else:
        file_path = None
    return file_path
