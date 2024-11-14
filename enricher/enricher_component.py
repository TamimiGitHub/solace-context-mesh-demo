import yaml

from solace_ai_connector.components.component_base import ComponentBase
info = {
    "class_name": "Enricher",
    "description": "Conver JSON Payload to yaml.",
    "config_parameters": [],
    "input_schema": {
        "type": "object",
        "properties": {},
    },
    "output_schema": {
        "type": "object",
        "properties": {},
    },
}

class Enricher(ComponentBase):
    def __init__(self, **kwargs):
        super().__init__(info, **kwargs)

    def invoke(self, message, data):
        # Message is the Solace Message with prop
        # Data is the payload
        
        # print(data)
        # loop through the data 
        items=[]
        for item in data:
            items.append(yaml.dump(item))
        return items