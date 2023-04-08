# Import thư viện spaCy và tải một model ngôn ngữ
import spacy
# nlp = spacy.load('en_core_web_sm')
nlp = spacy.load('en_core_web_lg')
# Chuỗi câu cần phân tích cú pháp
text = "The quick brown fox jumps over the lazy dog."
text = "Help me turn on the hallway light"

# Phân tích cú pháp câu nói bằng thư viện spaCy
doc = nlp(text)

# In ra các thành phần cú pháp trong câu nói
for token in doc:
    print(token.text, token.pos_, token.dep_)