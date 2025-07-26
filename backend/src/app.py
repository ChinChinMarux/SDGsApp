from fastapi import FastAPI, Request, Response
from fastapi.middleware import CORSMiddleware
from routes.__init__ import init_db
from routes import corpus_routes, analysis_routes, sdg_reference_routes, sdg_mapping_routes

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
    await init_db()
    
app.include_router(corpus_routes.router, prefix="/api")
app.include_router(analysis_routes.router, prefix="/api")
app.include_router(sdg_reference_routes.router, prefix="/api")
app.include_router(sdg_mapping_routes.router, prefix="/api")