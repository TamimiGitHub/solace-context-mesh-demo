# Realtime RAG Solace Demo

This demo uses the [Solace AI Connector](https://github.com/SolaceLabs/solace-ai-connector) to build a [Context Mesh](https://solace.com/blog/context-mesh-eda-key-ai-success/)

## Tech Stack

- Python 3
- Solace AI Connector

## To run

Open every section in a separate terminal window

### The Enricher

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

- Install dependencies

```
pip install -r requirements.txt
```

- Run the enricher with a topic subscription

```
python enricher.py -t <topic_subscription>
```

### Solace AI Connector

- Populate the envVars.env with the right env varibales
- Source the environment

```
source envVars.env
```

- Install the Solace AI Connector

```
python3 -m venv env
source env/bin/activate
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

### The frontend application

```
npm install
npm start
```