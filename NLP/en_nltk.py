
import nltk
from nltk.tokenize import word_tokenize
from nltk import pos_tag

# Khởi tạo tokenizer và POS tagger
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')

# Nhận câu từ Node.js
# sentence = input()
sentence = "Help me turn on the hallway light"

# Phân tách câu thành các từ và thực hiện POS tagging
tokens = nltk.word_tokenize(sentence)
tags = nltk.pos_tag(tokens)

# Chuyển đổi kết quả POS tagging thành chuỗi và gửi trở lại cho Node.js
result = ' '.join([f'{word}/{tag}' for word, tag in tags])
print(result)


