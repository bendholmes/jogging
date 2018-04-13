# Overview

This project is comprised of a Django web server driving a Django Rest Framework REST API which is then used by a
React SPA.

The project was developed on Windows but should work cross-platform. The SPA has been developed to work on the
latest version of Chrome.

# Installation

The project requires Python, PostgreSQL, Node.js, NPM and Chrome, along with several Python and NPM dependencies.

* Install Python:

        https://www.python.org/downloads/

* Install PostgreSQL:

        https://www.postgresql.org/download/

* Setup the Database. If you wish to use different values, be sure to update the `DATABASES` settings in `server/jogging/settings.py`.

    * Create a PostgreSQL user with the username `postgres` and password `postgres`

    * Create a PostgreSQL  database called `jogging`.

            https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e

* Install Node.js:

        https://nodejs.org/en/

* Install Chrome:

        https://www.google.ca/chrome/

* (**Optional, recommended**) Create and activate a virtual environment:

        http://docs.python-guide.org/en/latest/dev/virtualenvs/

* Install Python requirements; from the repository root:

        pip install -r requirements.txt

* Install NPM requirements; from the /web directory:

        npm install

# Running the Project

* In a shell, navigate to the root directory and run:

        python start.py

* **Note**: If you're having trouble with the start script, you can execute the required commands manually:

    * From `/server/`:

            python manage.py runserver 8080

    * From `/web/src/`:

            HOST=`127.0.0.1` npm start

# Running the Tests

## Python Tests

* From the `/server` directory:

        python manage.py test tests/

## Postman Tests

* Install Postman:

        https://www.getpostman.com/

* Import the `Jogging.postman_collection.json` collection config and the `local - admin.postman_environment.json` environment config.

* Ensure the Django web server is running (see above for running instructions).

* In the top bar, click `Runner`.

* Select the `jogging` collection and the `local - admin` environment, then click `Start Run`. Ensure that `Persist Variables` is unchecked.

    * **Note:** Some tests may fail the first run due to missing / incorrect environment variables. On the second try this should have resolved itself.

# Limitations

Please see the [project limitations](./LIMITATIONS.md) document for a discussion about the limitations of the project and how these could be improved.
