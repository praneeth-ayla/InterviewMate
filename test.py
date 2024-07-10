from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
import os
client = OpenAI()

api_key = os.getenv('OPENAI_API_KEY')

speech_file_path = speech_file_path = Path(__file__).parent / "1.1.2.mp3"

response = client.audio.speech.with_streaming_response(
  model="tts-1",
  voice="alloy",
  input="Today is a wonderful day to build something people love!"
)

response.stream_to_file(speech_file_path)

