from pydantic import BaseModel
from typing import Optional, List

class ParsedHeaderInfo(BaseModel):
    primary_id: str
    kingdom: Optional[str] = None
    phylum: Optional[str] = None
    class_: Optional[str] = None
    order: Optional[str] = None
    family: Optional[str] = None
    genus: Optional[str] = None
    species: Optional[str] = None
    other_info: Optional[str] = None

    class Config:
        # Allow 'class' as a field name
        allow_population_by_field_name = True
        fields = {"class_": "class"}

class FastaSequence(BaseModel):
    header_info: ParsedHeaderInfo
    sequence: str

class KmerSearchRequest(BaseModel):
    query_sequence: str
    k: int

class SimilarityResult(BaseModel):
    header_info: ParsedHeaderInfo
    sequence: str
    similarity_score: float

class KmerSearchResponse(BaseModel):
    results: List[SimilarityResult]
