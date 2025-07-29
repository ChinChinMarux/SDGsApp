# 🌍 SDGs Mapping Tools

A web application built using the **FARM Stack (FastAPI, React.js, MongoDB)** to assist in **mapping scientific publications to Sustainable Development Goals (SDGs)** using keyword extraction and topic modeling.

---

## 📌 Project Overview

**SDGs Mapping Tools** is a medium-scale research-oriented application developed to meet the analytical needs of **Pusat Riset Sains Data dan Informasi, BRIN Bandung**. The app facilitates:

- **Upload and processing of scientific documents**
- **Automatic extraction of keywords**
- **Topic classification and mapping to 17 SDGs**
- **Interactive visualization of mapping results**

This project is collaboratively built by:
- 👤 Bimo Kusumo  
- 👤 Yusry Anandita  
- 👤 Evan Adkara

---

## ⚙️ Tech Stack – FARM Stack

| Component | Technology  | Description |
|----------|--------------|-------------|
| **Frontend** | [React.js](https://reactjs.org/) | Building a fast, responsive user interface |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) | High-performance API for processing and inference |
| **Database** | [MongoDB](https://www.mongodb.com/) | NoSQL database for flexible and scalable document storage |

### 🔍 Why FARM Stack?

- **FastAPI**
  - ⚡ Asynchronous and extremely fast
  - 🧪 Auto-generated interactive API docs via Swagger and ReDoc
  - 🔐 Built-in support for modern Python type hints and validation

- **React.js**
  - 🔁 Component-based and reactive design
  - 💻 Ideal for building dynamic forms and data visualizations
  - 🌐 Works well with RESTful APIs

- **MongoDB**
  - 📂 Schema-less and ideal for storing unstructured publication data
  - 📈 Easy to scale and integrate with modern backend frameworks
  - ✅ Supports full-text search for keyword mapping

---

## 📚 Features

- 📝 Upload `.csv` or `.xlsx` documents
- 🧠 Topic modeling using LDA-based models
- 🗂️ Automatic keyword extraction
- 🎯 SDG classification based on keyword-to-SDG alignment
- 📊 Dashboard with interactive charts & SDG mapping heatmap
- 🔍 Full document history & delete functionality

---

## 🛠️ Installation & Run

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sdg-mapping-tools.git
cd sdg-mapping-tools
```
### 2. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
### 4. Setup MongoDB URL inside .env
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sdgdb
```

## API Documentation
Swagger UI: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc

## 📈 Future Plans
- ✅ Fine-tuned SDG classifier with machine learning
- 🌐 Multilingual document support
- 🧩 Knowledge graph visualization using SDG ontology
- 🔐 Role-based access control for stakeholders and researchers

## 🤝 Acknowledgements
This project is built in collaboration with the Pusat Riset Sains Data dan Informasi – BRIN Bandung to support national research alignment with the UN Sustainable Development Goals (SDGs).
