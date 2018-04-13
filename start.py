import subprocess, os

subprocess.Popen("python manage.py runserver 8080", cwd="./server/")

env = os.environ.copy()
env["HOST"] = '127.0.0.1'
subprocess.Popen("npm start", cwd="./web/src/", shell=True, env=env)
