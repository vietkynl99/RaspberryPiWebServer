import nltk

# Tải xuống các tài nguyên cần thiết
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('tagsets')

# Câu cần phân tích
# sentence = "John eats an apple"
sentence = "Help me turn on the hallway light"

# Phân tích câu thành các từ
tokens = nltk.word_tokenize(sentence)

# Xác định loại từng từ trong câu
tagged_tokens = nltk.pos_tag(tokens)

# In loại từng từ trong câu
print()
print(tagged_tokens)

# In mô tả chi tiết về các loại từ
# nltk.help.upenn_tagset()




# Lọc các động từ và danh từ
verbs = [word for word, tag in tagged_tokens if tag.startswith('V')]
nouns = [word for word, tag in tagged_tokens if tag.startswith('N')]

print("")
print("Filter Verbs:", verbs)
print("Filter nouns:", nouns)

# Xác định tân ngữ
object_index = None
for i, (word, tag) in enumerate(tagged_tokens):
    if tag == 'DT' and i+1 < len(tagged_tokens) and tagged_tokens[i+1][1].startswith('N'):
        object_index = i+1
        break
object = tagged_tokens[object_index][0] if object_index is not None else None

# In động từ và tân ngữ
print("Verbs:", verbs)
print("Object:", object)
# Kết quả sẽ là:

# Verbs: ['eats']
# Object: apple