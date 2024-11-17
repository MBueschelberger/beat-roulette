"""
Beat roulette backend main module
"""
import uvicorn
from fastapi import FastAPI
from .routers.tabs import router as tabs_router

app = FastAPI(root_path="/api")
app.include_router(tabs_router)

