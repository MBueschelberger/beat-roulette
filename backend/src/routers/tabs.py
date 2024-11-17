"""
Tabs router
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from .utils import get_file, list_files
from typing import List


router = APIRouter(
    prefix="/tabs",
    tags=["tabs"],
)

@router.get("/")
async def get_tabs() -> List[str]:
    """
    Return a list of available tabs.

    This endpoint returns a list of all available tab files in the configured
    directory.
    """
    return list_files()

@router.get("/{file_name}")
async def get_tab(file_name: str):
    """
    Return the contents of a specific tab file.

    This endpoint returns the contents of a tab file from the configured
    directory.

    Args:
        file_name (str): The name of the file to return.

    Returns:
        FileResponse: The contents of the file.
    """
    tab_file = get_file(file_name)
    if not tab_file:
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(get_file(file_name))
