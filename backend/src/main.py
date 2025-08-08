from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import corpus_routes, analysis_routes, sdg_mapping_routes, graph_routes, users_routes

app = FastAPI()

origins=[
    "http://localhost:5173",   #change based on us localhost ports
    "http://localhost:5174",
]
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"]
    )

    
app.include_router(corpus_routes.router, prefix="/api")
app.include_router(graph_routes.router, prefix="/api")
app.include_router(users_routes.router, prefix="/api")