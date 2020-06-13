# advancedDBs-MSC
Search Engine with Texts for the Advanced Database MSc course

## Prerequisites

NodeJS should be installed
Python 3.6+ should be installed and included in the PATH variable
A MongoDB should be installed and mongod service should be active

## Installation

To install the GUI the following steps should be executed:
- `cd advancedDB-gui`
- `npm i`
- `npm start`

To install the REST API server the following steps should be executed:
- `cd advancedDB-rest-api`
- `npm i`
- `npm start`

To install the python libraries for processing the texts:
- `pip install pymongo argparse`
- `pip install sklearn`
- `pip install -U spacy`
- `pip install --user -U nltk`

To install the data at initialization:
- `cd ./data`
- `unzip data.zip`
- `cp ../advancedDB-rest-api/server/pythonScripts/search.py .`
- `python3.6 search.py --k 5 --metric cosine --init --query "searchTerm"`
- `rm search.py`
