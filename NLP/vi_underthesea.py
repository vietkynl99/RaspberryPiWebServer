# https://github.com/undertheseanlp/underthesea

# N: danh từ (noun)
# Np: danh từ riêng (proper noun)
# Nu: danh từ đơn vị đếm được (countable unit noun)
# Nc: danh từ đơn vị không đếm được (uncountable unit noun)
# V: động từ (verb)
# A: tính từ (adjective)
# P: giới từ (preposition)
# E: từ liên kết (conjunction)
# R: phó từ (adverb)
# M: số từ (numeral)
# C: từ đặc biệt (special word)
# X: từ không xác định (unknown word)

import underthesea


def analysis(sentence):
    sentence = sentence.strip().lower()
    if sentence == "":
        return ""
    else:
        return underthesea.pos_tag(sentence)


# sentence = "Tôi thích học máy học."
# sentence = "Cô giáo tôi dạy toán cấp 3"
# tagged_sentence = underthesea.pos_tag(sentence)
# print(tagged_sentence)


print(analysis('Bật đèn 1'))
print(analysis('Chỉnh độ sáng của đèn về 20%'))
