FROM python:3.12

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml poetry.lock /app/
RUN touch README.md
RUN pip install poetry && poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

copy . /app/

RUN poetry install

EXPOSE 8000/tcp
CMD ["poetry", "run", "python", "-m", "gunicorn", "ionizer.asgi:application", "--graceful-timeout", "5", "-w", "4", "-b", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker"]
