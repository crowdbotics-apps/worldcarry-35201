FROM crowdbotics/cb-django:3.8-slim-buster AS build

# Copy dependency management files and install app packages to /.venv

COPY ./Pipfile ./Pipfile.lock /
RUN PIPENV_VENV_IN_PROJECT=1 pipenv install --deploy


FROM crowdbotics/cb-django:3.8-slim-buster AS release
ARG SECRET_KEY

# Set Working directory
WORKDIR /opt/webapp

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3-dev libpq-dev gcc curl wget unzip zip gnupg2 \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*
  # You can add additional steps to the build by appending commands down here using the
  # format `&& <command>`. Remember to add a `\` at the end of LOC 12.
  # WARNING: Changes to this file may cause unexpected behaviors when building the app.
  # Change it at your own risk.






#FROM python:3.8-slim as base
#
## libpq-dev and python3-dev help with psycopg2
#RUN apt-get update \
#  && apt-get install -y --no-install-recommends python3-dev libpq-dev gcc curl wget unzip zip gnupg2 \
#  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
#  && rm -rf /var/lib/apt/lists/*
#  # You can add additional steps to the build by appending commands down here using the
#  # format `&& <command>`. Remember to add a `\` at the end of LOC 12.
#  # WARNING: Changes to this file may cause unexpected behaviors when building the app.
#  # Change it at your own risk.
#

RUN sed -i -- 's&deb http://deb.debian.org/debian jessie-updates main&#deb http://deb.debian.org/debian jessie-updates main&g' /etc/apt/sources.list \
  && apt-get update && apt-get install wget -y
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list \
  && apt-get update && apt-get -qqy install ${CHROME_VERSION:-google-chrome-stable}

RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`/chromedriver_linux64.zip
RUN unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/



RUN apt-get update \
    && apt-get install -y binutils libproj-dev gdal-bin python3-gdal --fix-missing

# Add runtime user with respective access permissions
RUN groupadd -r django \
  && useradd -d /opt/webapp -r -g django django \
  && chown django:django -R /opt/webapp
USER django

# Copy virtual env from build stage
COPY --chown=django:django --from=build /.venv /.venv
ENV PATH="/.venv/bin:$PATH"

# Copy app source
COPY --chown=django:django . .

# Collect static files and serve app
RUN python3 manage.py collectstatic --no-input
CMD waitress-serve --port=$PORT worldcarry_35201.wsgi:application
