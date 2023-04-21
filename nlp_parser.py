# pip install spacy (pip3 install spacy)
# python -m spacy download en_core_web_lg (sudo python3 -m spacy download en_core_web_lg)
# python -m spacy download en_core_web_sm (sudo python3 -m spacy download en_core_web_sm)

USER_LARGE_VERSION = 1


def sendJsonData(obj):
    output_str = json.dumps(obj)
    print(output_str)

def checkHaveContent(string, contentList):
    count = 0
    index = -1
    idx = -1
    for content in contentList:
        idx += 1
        if string.find(content) != -1:
            count += 1
            index = idx
    if count == 1:
        return index
    else:
        return -1
    
class Device:
    def __init__(self, rootVerb, verb, rootNoun, noun):
        self.rootVerb = rootVerb
        self.verb = verb
        self.rootNoun = rootNoun
        self.noun = noun

device1 = Device(["turn"], ["turn on", "turn off"], ["lamp"], ["lamp 1"])
device2 = Device(["turn"], ["turn on", "turn off"], ["lamp"], ["lamp 2"])
device3 = Device(["turn"], ["turn on", "turn off"], ["lamp"], ["lamp 3"])
devicesList = [device1, device2, device3]


# Import spaCy libaray with English model
try:
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

# success event
sendJsonData({"event": "init done"})


while 1:
    try:
        # Get input from Node.js
        sentence = input().lower().strip()
        # sentence = input().strip()
        if sentence == "":
            sendJsonData({"event": "parser error", "description": "Empty string"})
        # Parsing sentences using spaCy library
        doc = nlp(sentence)
        # Print out the syntactic elements in the sentence
        result = ""
        isNegative = False
        verb = []
        noun = []

        for token in doc:
            result += "[" + token.text + " " + token.pos_ + " " + token.dep_ + "]"
            if token.dep_ == 'neg' or token.text.lower() in ["not", "no", "never", "neither", "nor", "nobody"]:
                isNegative = True
            if token.pos_.find("VERB") != -1 :
                   verb.append(token.text)
            if token.pos_.find("NOUN") != -1 :
                   noun.append(token.text)

        understandable = False
        acceptedDeviceCount = 0
        mainVerb = ""
        mainNoun = ""
        if not isNegative and len(verb) == 1 and len(noun) == 1:
            for device in devicesList :
                if checkHaveContent(verb[0], device.rootVerb) >= 0 and checkHaveContent(noun[0], device.rootNoun) >= 0:
                    indexVerb = checkHaveContent(sentence, device.verb)
                    indexNoun = checkHaveContent(sentence, device.noun)
                    if indexVerb >= 0 and indexNoun >= 0:
                        acceptedDeviceCount += 1
                        mainVerb = device.verb[indexVerb]
                        mainNoun = device.noun[indexNoun]
        if acceptedDeviceCount == 1:
            understandable = True
            result = "OK. " + mainVerb.capitalize() + " the " + mainNoun + "."
        elif acceptedDeviceCount > 1:
            understandable = True
            result = "You can only control 1 device with 1 command."

        if not understandable:
            result = "Sorry. I don't understand your question."
        sendJsonData({"event": "result", "sentence": sentence, "result": result})
    except Exception as e:
        sendJsonData({"event": "parser error", "description": str(e)})
