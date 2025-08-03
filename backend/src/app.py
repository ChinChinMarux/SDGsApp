from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from src.routes.__init__ import init_db
from src.config.db import ping_db
from src.routes import corpus_routes, analysis_routes, sdg_reference_routes, sdg_mapping_routes, graph_routes

app = FastAPI()

origins=[
    "http://localhost:5173",   #change based on us localhost ports
    "http://localhost:5174",
]
app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins, 
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"]
    )

@app.on_event("startup")
async def start_db():
    try:
        await ping_db()
        print("Ping success!")
    except Exception as e:
        print(" Ping failed:", e)
        
    try:
        await init_db()
        print(" Init DB success!")
    except Exception as e:
        print(" Init DB failed:", e)
    
app.include_router(corpus_routes.router, prefix="/api")
app.include_router(analysis_routes.router, prefix="/api")
app.include_router(sdg_reference_routes.router, prefix="/api")
app.include_router(sdg_mapping_routes.router, prefix="/api")
app.include_router(graph_routes.router, prefix="/api")