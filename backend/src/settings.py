from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    
    file_directory: str = Field("/data", description="The directory where the tabs for the beat roulette are stored")


settings = Settings() 
