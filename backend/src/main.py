from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import List
import bio_core.fasta as fasta
import bio_core.kmer as kmer
from models.bio_data import FastaSequence, KmerSearchRequest, KmerSearchResponse
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

dataset_file_path = Path("IF3211_Dataset.fasta")
try:
    fasta_sequences = fasta.parse_fasta_file(dataset_file_path)
    print(f"Successfully loaded {len(fasta_sequences)} sequences from file: {dataset_file_path}")
    if fasta_sequences:
        print(f"First sequence ID: {fasta_sequences[0].header_info.primary_id}")
        print(f"First sequence length: {len(fasta_sequences[0].sequence)}")
    print("--- Loading Complete ---")
except Exception as e:
    print(f"Failed to parse FASTA dataset file: {dataset_file_path}, error: {e}")
    raise e

@app.post("/kmer_search", response_model=KmerSearchResponse)
async def kmer_search(request_data: KmerSearchRequest):
    query_sequence = request_data.query_sequence
    k = request_data.k
    top_n = 10

    if k == 0:
        raise HTTPException(status_code=400, detail="K-mer size (k) must be greater than 0")
    if not query_sequence:
        raise HTTPException(status_code=400, detail="Query sequence cannot be empty")

    top_matches = kmer.find_top_n_matches(query_sequence, fasta_sequences, k, top_n)
    return KmerSearchResponse(results=top_matches)

if __name__ == "__main__":
    print("Starting bioinformatics API server at http://127.0.0.1:8080")
    uvicorn.run(app, host="127.0.0.1", port=8080)
