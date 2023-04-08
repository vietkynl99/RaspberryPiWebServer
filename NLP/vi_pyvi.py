from pyvi import ViPosTagger

text = "bật đèn cầu thang"
words, tags = ViPosTagger.postagging(text)
for i in range(len(words)):
    print(words[i], tags[i])