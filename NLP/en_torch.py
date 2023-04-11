import torch
from transformers import pipeline

# load pre-trained model
model = pipeline("question-answering")

# example question and context
question = "What is the capital of France?"
context = "The capital city of France is Paris."

# get answer
result = model(question=question, context=context)

# print answer
print()
print()
print(result['answer'])