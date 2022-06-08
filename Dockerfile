FROM python:3.9-alpine
WORKDIR /django_ci
COPY ./ /django_ci
RUN apk add --no-cache python3 postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    apk update && pip install -r /django_ci/requirements.txt --no-cache-dir

EXPOSE 8000
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]