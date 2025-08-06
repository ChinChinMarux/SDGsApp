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

# model="./LDAModels.pkl"

# def preprocess(texts):
#     stop_words = set(stopwords.words("english"))
#     return [
#         [word for word in word_tokenize(doc.lower()) if word.isalpha() and word not in stop_words]
#         for doc in texts
#     ]

# def save_model(lda_model, dictionary, corpus):
#     """Simpan model, dictionary, dan corpus ke dalam file .pkl"""
#     with open(model, "wb") as f:
#         pickle.dump({
#             "model": lda_model,
#             "dictionary": dictionary,
#             "corpus": corpus
#         }, f)

# def load_model():
#     """Load model, dictionary, dan corpus dari file .pkl"""
#     if not os.path.exists(model):
#         raise FileNotFoundError("Model LDA belum dilatih dan disimpan.")
    
#     with open(model, "rb") as f:
#         data = pickle.load(f)
#         return data["model"], data["dictionary"], data["corpus"]

# def run_lda_analysis(texts, num_topics=10, iterations=50, retrain=True):
#     """
#     Latih ulang model LDA atau gunakan model yang sudah ada.
#     """
#     processed_texts = preprocess(texts)

#     if retrain:
#         # Buat dictionary dan corpus baru
#         dictionary = corpora.Dictionary(processed_texts)
#         corpus = [dictionary.doc2bow(text) for text in processed_texts]

#         # Latih model baru
#         lda_model = models.LdaModel(
#             corpus=corpus,
#             id2word=dictionary,
#             num_topics=num_topics,
#             iterations=iterations,
#             passes=10,
#             random_state=42,
#         )

#         # Simpan model ke file
#         save_model(lda_model, dictionary, corpus)
#     else:
#         # Load model yang sudah ada
#         lda_model, dictionary, corpus = load_model()

#     # Hitung koherensi model
#     coherence_model = CoherenceModel(
#         model=lda_model,
#         texts=processed_texts,
#         dictionary=dictionary,
#         coherence='c_v'
#     )
#     coherence = coherence_model.get_coherence()

#     # Ambil hasil topik
#     topics = lda_model.print_topics(num_topics=num_topics)
#     result = [f"Topic {i + 1}: {t}" for i, t in enumerate([x[1] for x in topics])]

#     return result, coherence


def preprocess(texts):
    stop_words = set(stopwords.words("english"))
    return [
        [word for word in word_tokenize(doc.lower()) if word.isalpha() and word not in stop_words]
        for doc in texts
    ]

def run_lda_analysis(texts, num_topics, iterations):
    processed_texts = preprocess(texts)

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

    # Hitung koherensi
    coherence_model = CoherenceModel(
        model=lda_model,
        texts=processed_texts,
        dictionary=dictionary,
        coherence='c_v'
    )
    coherence = coherence_model.get_coherence()

    # Ambil topik hasil
    topics = lda_model.print_topics(num_topics=num_topics)
    result = [f"Topic {i + 1}: {t}" for i, t in enumerate([x[1] for x in topics])]

    return result, coherence
