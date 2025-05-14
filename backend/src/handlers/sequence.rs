// src/handlers/sequence.rs

use actix_web::{post, web, HttpResponse, Responder};
use std::sync::Arc; 

use crate::bio_core::kmer::find_top_n_matches;
use crate::models::bio_data::{
    FastaSequence,
    KmerSearchRequest,
    KmerSearchResponse,
};

type SharedFastaData = Arc<Vec<FastaSequence>>;

#[post("/kmer_search")]
async fn kmer_search(
    fasta_data: web::Data<SharedFastaData>,
    request_data: web::Json<KmerSearchRequest>,
) -> impl Responder {
    let query_sequence = &request_data.query_sequence;
    let k = request_data.k;
    let top_n = 10;

    if k == 0 {
         return HttpResponse::BadRequest().body("K-mer size (k) must be greater than 0");
    }

    if query_sequence.is_empty() {
         return HttpResponse::BadRequest().body("Query sequence cannot be empty");
    }


    let top_matches = find_top_n_matches(
        query_sequence,
        &*fasta_data, 
        k,
        top_n,
    );

    let response = KmerSearchResponse {
        results: top_matches,
    };

    HttpResponse::Ok().json(response)
}