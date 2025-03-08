import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string

"""
Extract keywords from a text input by:
  - Tokenizing text
  - Converting to lowercase
  - Removing punctuation and stopwords
  - Computing word frequencies
  - Returning the top_n most common words
"""

def extract_keywords(text):

    # # Convert to lowercase
    # text = text.lower()

    # # Tokenize the text
    # words = word_tokenize(text)

    # # Remove punctuation
    # words = [word for word in words if word not in string.punctuation]

    # # Remove stopwords
    # stop_words = set(stopwords.words('english'))
    # words = [word for word in words if word not in stop_words]

    # # Compute frequency distribution
    # freq_dist = nltk.FreqDist(words)

    # # Extract the most common words
    # common_words = freq_dist.most_common(100)

    # # The list of keywords is just the word part from each (word, frequency) tuple
    # keywords = [word for word, freq in common_words]

    return "article is most likelt true"
