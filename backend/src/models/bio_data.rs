use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParsedHeaderInfo {
    pub primary_id: String,
    pub kingdom: Option<String>,
    pub phylum: Option<String>,
    pub class: Option<String>,
    pub order: Option<String>,
    pub family: Option<String>,
    pub genus: Option<String>,
    pub species: Option<String>,
    pub other_info: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FastaSequence {
    #[serde(flatten)]
    pub header_info: ParsedHeaderInfo,
    pub sequence: String, 
}

#[derive(Debug, Deserialize)]
pub struct KmerSearchRequest {
    pub query_sequence: String,
    pub k: usize,               
}

#[derive(Debug, Clone, Serialize)]
pub struct SimilarityResult {
    #[serde(flatten)] 
    pub header_info: ParsedHeaderInfo,
    pub sequence: String,
    pub similarity_score: f64,
}

#[derive(Debug, Serialize)]
pub struct KmerSearchResponse {
    pub results: Vec<SimilarityResult>,
}