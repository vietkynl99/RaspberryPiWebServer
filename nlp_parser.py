USER_LARGE_VERSION = 1


def sendJsonData(obj):
    output_str = json.dumps(obj)
    print(output_str)


try:
    # Import spaCy libaray with English model
    import sys
    import json
    import spacy
    if USER_LARGE_VERSION == 1:
        nlp = spacy.load('en_core_web_lg')      # large version
    else:
        nlp = spacy.load('en_core_web_sm')      # small version
except Exception as e:
    # Send error to Node.js
    sendJsonData({"event": "init error", "description": str(e)})
    sys.exit(1)


sendJsonData({"event": "init done"})


while 1:
    try:
        # Get input from Node.js
        # sentence = input().lower().strip()
        sentence = input().strip()
        if sentence == "":
            sendJsonData({"event": "parser error", "description": "Empty string"})
        # Parsing sentences using spaCy library
        doc = nlp(sentence)
        # Print out the syntactic elements in the sentence
        result = ""
        for token in doc:
            result += "[" + token.text + " " + token.pos_ + " " + token.dep_ + "]"
        sendJsonData({"event": "result", "sentence": sentence, "result": result})
    except Exception as e:
        sendJsonData({"event": "parser error", "description": str(e)})
