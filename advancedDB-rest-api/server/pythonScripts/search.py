from pymongo import MongoClient
import json
import argparse
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.text import TextCollection
from spacy.lang.en import English
import re
import os
from spacy.lang.en.stop_words import STOP_WORDS
from sklearn.metrics import pairwise_distances
from scipy.sparse import csr_matrix
from sklearn.neighbors import KNeighborsClassifier
import sys
import numpy as np
import spacy
import warnings
from sklearn.exceptions import DataConversionWarning
warnings.filterwarnings(action='ignore', category=DataConversionWarning)
np.set_printoptions(threshold=sys.maxsize)
import nltk
words = set(nltk.corpus.words.words())
# Load English tokenizer, tagger, parser, NER and word vectors
nlp = spacy.load("en_core_web_sm")

def unique(list1):
  
    # intilize a null list
    unique_list = []
      
    # traverse for all elements
    for x in list1:
        # check if exists in unique_list or not
        if x not in unique_list:
            unique_list.append(x)
    return unique_list

def listToString(s):
    
    # initialize an empty string
    str1 = " "
    
    # return string
    return (str1.join(s))

def removeStopwords(text):
   text = re.sub('\n', ' ', text)
   text = re.sub('|', '', text)
   text = " ".join(w for w in nltk.wordpunct_tokenize(text) if w.lower() in words or not w.isalpha())
   #  "nlp" Object is used to create documents with linguistic annotations.
   my_doc = nlp(text)
   
   # Create list of word tokens
   token_list = []
   filtered_sentence =[]
   for token in my_doc:
      word = token.text
      lexeme = nlp.vocab[word]
      sampleWord = nlp(word)[0]
      if lexeme.is_stop == False and lexeme.is_punct == False and lexeme.is_bracket == False and lexeme.is_right_punct == False and lexeme.is_left_punct == False and lexeme.is_quote == False:
         if sampleWord.pos_ == 'ADJ' or sampleWord.pos_ == 'NOUN' or sampleWord.pos_ == 'PROPN' or sampleWord.pos_ == 'ADV' or sampleWord.pos_ == 'VERB' or sampleWord.pos_ == 'INTJ':
            lemmatizedWord = nlp(word)[0].lemma_
            filtered_sentence.append(lemmatizedWord.lower())
      
   return filtered_sentence

def initialization():
   # ####################################################################################
   # Loads the text documents in json format into MongoDB
   # example usage is `find . -iname "*text.json" -exec python test2.py {} \;`
   # ####################################################################################
   cwd = os.getcwd()
   listOfFiles = os.listdir('./data')
   vocabulary = []
   counter = 1
   for fil in listOfFiles:
      with open(str(cwd)+"/data/"+str(fil)+"/text.json") as template:
        template_dct = json.load(template)
   
      template_dct = json.loads(template_dct)
      filteredText = removeStopwords(template_dct['wikitext'])
      vocabulary = vocabulary + filteredText
      counter += 1
      print(counter)
   
   vocabulary = unique(vocabulary)
   print(len(vocabulary))
   template_dct['vocabulary'] = vocabulary
   result = db.vocabulary.insert_one(template_dct)
   
   vectorizer = TfidfVectorizer(stop_words='english', vocabulary = vocabulary)
   filteredText = [listToString(vocabulary)]
   model = vectorizer.fit_transform(filteredText)
   
   for fil in listOfFiles:
      with open(str(cwd)+"/data/"+str(fil)+"/text.json") as template:
        template_dct = json.load(template)
   
      template_dct = json.loads(template_dct)
      filteredText = removeStopwords(template_dct['wikitext'])
      template_dct['filteredText'] = filteredText
      filteredText = [listToString(filteredText)]
      
      vector = vectorizer.transform(filteredText)
      vector = vector.toarray()
      
      template_dct['vector'] = vector[0].tolist()
      print(len(template_dct['vector']))
      result = db.documents.insert_one(template_dct)
      print('Inserted post id %s ' % result.inserted_id)

# ####################################################################################
# Get all the saved vectorized documents
# ####################################################################################
parser = argparse.ArgumentParser()
parser.add_argument("--k", required=True,
   help="K Neighbors", type=int)
parser.add_argument("--metric", required=True,
   help="Metric definition")
parser.add_argument("--query", required=True,
   help="Search query")
parser.add_argument("--init", nargs='?',
                        const=True, default=False,
                        help="Activate init mode.")
args = vars(parser.parse_args())
k = args['k']
metric = args['metric']
init = args['init']
dbclient = MongoClient()
db = dbclient.advancedDBs

if init == True:
   initialization()

result = db.documents.find({},{"vector": 1,"title": 1, 'filteredText': 1,'wikitext': 1, "_id": 0 })
query = args['query']
filteredQuery = removeStopwords(query)
vocabulary = json.loads(json.dumps(db.vocabulary.find({},{"vocabulary": 1, "_id": 0 })[0]))
vocabulary = vocabulary['vocabulary']
vectorizer = TfidfVectorizer(stop_words='english', vocabulary = vocabulary)
filteredText = [listToString(vocabulary)]
model = vectorizer.fit_transform(filteredText)
vector = vectorizer.transform(filteredQuery)
titles = []
scores = []

for i in result:
   doc = json.loads(json.dumps(i))
   title = doc['title']
   originalText = doc['wikitext']
   occurencies = 0
   for i in filteredQuery:
      if i in removeStopwords(doc['title']):
         occurencies += 60
      if i in doc['filteredText']:
         occurencies += 20
   
   if occurencies >= 100:
      occurencies = 90
   doc = doc['vector']
   titles.append({
   "title": title,
   "originalText": originalText,
   "relevance": occurencies
   })
   sss = csr_matrix(doc)
   
   cp = pairwise_distances(vector.toarray(),sss.toarray(),metric=metric)
   sum = 0
   for i in cp[0]:
      sum+= i
   similarity = sum /len(cp[0])
   scores.append(similarity)

indexes = np.asarray(scores).argsort()[:k]
results = []
for i in indexes:
   titles[i]['distance'] = round(scores[i],4)
   results.append(titles[i])

print(json.dumps(results))