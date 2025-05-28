from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
import ollama
import re
import os
import subprocess

# Initialize FastAPI app
app = FastAPI()


class ParagraphInput(BaseModel):
    paragraph: str


def extract_keywords(paragraph, top_n=5):
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([paragraph])
    scores = zip(vectorizer.get_feature_names_out(), tfidf_matrix.toarray()[0])
    sorted_keywords = sorted(scores, key=lambda x: x[1], reverse=True)
    top_keywords = [word for word, score in sorted_keywords[:top_n]]
    return top_keywords


def classify_sentiment(paragraph):
    keywords = extract_keywords(paragraph)
    keyword_str = ", ".join(keywords)

    system_prompt = (
        "You are a helpful assistant that classifies the sentiment of a given paragraph "
        "as Positive, Negative, or Neutral and explains the reason behind it. "
        "You are also provided with important keywords extracted using TF-IDF.\n\n"
        "Respond in the following format:\n"
        "Sentiment: <Positive/Negative/Neutral>\n"
        "Reason: <Your explanation here>"
    )

    user_prompt = f"""
    Paragraph: {paragraph}

    Extracted Keywords (TF-IDF): {keyword_str}

    What is the sentiment of the above paragraph? Please follow the format:
    Sentiment: <Positive/Negative/Neutral>
    Reason: <Your explanation>
    """

    response = ollama.chat(
        model='llama3',
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    content = response['message']['content'].strip()

    sentiment_match = re.search(
        r"Sentiment:\s*(Positive|Negative|Neutral)", content, re.IGNORECASE)
    reason_match = re.search(r"Reason:\s*(.+)", content,
                             re.IGNORECASE | re.DOTALL)

    sentiment = sentiment_match.group(
        1).capitalize() if sentiment_match else "Unknown"
    reason = reason_match.group(1).strip(
    ) if reason_match else "No reason provided."

    return sentiment, reason

# Ensure Ollama is started when the container runs


def start_ollama():
    # Start Ollama in the background (this assumes Ollama can run in the container)
    subprocess.Popen(['ollama', 'run', 'llama3'])


# Run Ollama when the app starts
start_ollama()


@app.get("/health")
async def health_check():
    """Health check endpoint for container monitoring"""
    return JSONResponse(content={"status": "healthy", "service": "ai-sentiment-analysis"})


@app.post("/analyze_sentiment")
async def analyze_sentiment(input_data: ParagraphInput):
    sentiment, reason = classify_sentiment(input_data.paragraph)
    return JSONResponse(content={"sentiment": sentiment, "reason": reason})

# to run this you'll need ollama modal locally installed and fastapi ,sklearn ,pydantic , re
# tats it you're goode to go !!
# uvicorn app:app --reload (this is the run command !!!!)
# uvicorn app:app --host 0.0.0.0 --port 8000 --reload
