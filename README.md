# Realtime RAG Solace Demo

This demo uses the [Solace AI Connector](https://github.com/SolaceLabs/solace-ai-connector) to build a [Context Mesh](https://solace.com/blog/context-mesh-eda-key-ai-success/)

## Tech Stack

- Python 3
- Solace AI Connector
- Node 18+

## To run

Open every section in a separate terminal window

### 1. The Enricher

- Run the enricher
- Navigate to the `enricher` directory

```
cd enricher
```

- [Optional] create a virtual environment

```
python3 -m venv env
source env/bin/activate
```

Note: If you are using WSL or Ubunto you might need to install `python3.8-vnenv`

- Install dependencies

```
pip install --upgrade pip
pip install -r requirements.txt
```

- Run the enricher with a topic subscription

```
python enricher.py -t <topic_subscription>
```

Note: This runs the enricher with default broker credentials. To pass custom host, username, pwd run the enrticher as follows

```
SOLACE_HOST=<host_name> SOLACE_VPN=<vpn_name> SOLACE_USERNAME=<username> SOLACE_PASSWORD=<password> python enricher.py -t 'hello/world'
```

### 2. Solace AI Connector

- Populate the envVars.env with the right env varibales
- Source the environment

```
source envVars.env
```

- Install the Solace AI Connector

```
python3 -m venv env
source env/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install solace-ai-connector
```

- Download the RAG configuration

```
curl https://raw.githubusercontent.com/SolaceLabs/solace-ai-connector/main/examples/llm/openai_chroma_rag.yaml > openai_chroma_rag.yaml
```

- Run the Solace AI connector with the rag configuration

```
solace-ai-connector openai_chroma_rag.yaml
```

### 3. The frontend application

```
npm install
npm start
```

## Architecure

![Architecture Diagram](src/images/realtimeRAG.png)
