from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse  # Importar HTMLResponse
from pydantic import BaseModel
import requests

class Question(BaseModel):
    question: str

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
async def read_index():
    with open("frontend/index.html") as f:
        return HTMLResponse(content=f.read(), status_code=200)

@app.post("/consultar")
async def consultar(question: Question):
    url = "http://localhost:11434/api/generate"  # Cambia esto por la dirección correcta si es diferente
    data = {
        "model": "medllama2",
        "prompt": question.question
    }
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return {"respuesta": response.json().get("generated_text")}
        else:
            raise HTTPException(status_code=response.status_code, detail="Error al consultar a MedLlama2")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error en la solicitud a MedLlama2: " + str(e))
