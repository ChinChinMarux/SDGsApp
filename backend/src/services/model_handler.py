import pickle
from gensim import corpora, models
from gensim.models.coherencemodel import CoherenceModel
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk
import os
nltk.download("punkt")
nltk.download("punkt_tab")
nltk.download("stopwords")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "LDAModels50.pkl")

def preprocess(texts):
    stop_words = set(stopwords.words("english"))
    return [
        [word for word in word_tokenize(doc.lower()) if word.isalpha() and word not in stop_words]
        for doc in texts
    ]

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model LDA belum dilatih di {MODEL_PATH}.")
    with open(MODEL_PATH, "rb") as f:
        data = pickle.load(f)
        return data["model"], data["dictionary"], data["corpus"]

def save_model(lda_model, dictionary, corpus):
    with open(MODEL_PATH, "wb") as f:
        pickle.dump({
            "model": lda_model,
            "dictionary": dictionary,
            "corpus": corpus
        }, f)

def run_lda_analysis(texts, num_topics=10, iterations=50, retrain=True):
    processed_texts = preprocess(texts)

    if not retrain:
        lda_model, dictionary, _ = load_model()
        corpus = [dictionary.doc2bow(text) for text in processed_texts]
    else:
        dictionary = corpora.Dictionary(processed_texts)
        corpus = [dictionary.doc2bow(text) for text in processed_texts]
        lda_model = models.LdaModel(
            corpus=corpus,
            id2word=dictionary,
            num_topics=num_topics,
            iterations=iterations,
            passes=10,
            random_state=42,
        )
        save_model(lda_model, dictionary, corpus)

    coherence_model = CoherenceModel(
        model=lda_model,
        texts=processed_texts,
        dictionary=dictionary,
        coherence='c_v'
    )
    coherence = coherence_model.get_coherence()

    topics = lda_model.print_topics(num_topics=num_topics)
    result = [f"Topic {i + 1}: {t}" for i, t in enumerate([x[1] for x in topics])]

    return result, coherence

# def preprocess(texts):
#     stop_words = set(stopwords.words("english"))
#     return [
#         [word for word in word_tokenize(doc.lower()) if word.isalpha() and word not in stop_words]
#         for doc in texts
#     ]

# def run_lda_analysis(texts, num_topics, iterations):
#     processed_texts = preprocess(texts)

#     dictionary = corpora.Dictionary(processed_texts)
#     corpus = [dictionary.doc2bow(text) for text in processed_texts]

#     lda_model = models.LdaModel(
#         corpus=corpus,
#         id2word=dictionary,
#         num_topics=num_topics,
#         iterations=iterations,
#         passes=10,
#         random_state=42,
#     )

#     coherence_model = CoherenceModel(
#         model=lda_model,
#         texts=processed_texts,
#         dictionary=dictionary,
#         coherence='c_v'
#     )
#     coherence = coherence_model.get_coherence()

#     topics = lda_model.print_topics(num_topics=num_topics)
#     result = [f"Topic {i + 1}: {t}" for i, t in enumerate([x[1] for x in topics])]

#     return result, coherence
