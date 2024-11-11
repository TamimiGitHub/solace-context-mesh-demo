# Realtime RAG Solace Demo

This demo uses the [Solace AI Connector](https://github.com/SolaceLabs/solace-ai-connector) to build a [Context Mesh](https://solace.com/blog/context-mesh-eda-key-ai-success/)

## Tech Stack

- Python 3
- Solace AI Connector
- Node 18+

## To run

Open every section in a separate terminal window

### 1. Solace AI Connector

- Populate the `envVars.env` with the right env varibales. Note: either create a new `envVars.env` or rename the `envVars.env.template`

- Source the environment

```
source envVars.env
```

- [Optional] create a virtual environment

```
python3 -m venv env
source env/bin/activate
```

Note: You might need to `python3.8-vnenv` on WSL instead

- Install the Solace AI Connector

```
python3 -m venv env
source env/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install solace-ai-connector
```

- Run the Solace AI connector with the rag configuration

```
TOPIC_SUB='insert/topic/here/>' solace-ai-connector openai_chroma_rag.yaml
```

### 2. The frontend application

```
npm install
npm start
```

### Cleanup

When done, you can simply delete the vector database and any log files

```
rm -fr chroma_data
rm *.log
```

## Architecure

![Architecture Diagram](src/images/realtimeRAG.png)
