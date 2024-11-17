FROM python:3.10-slim-bullseye

RUN apt update && apt upgrade -y

RUN pip install pip --upgrade

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
