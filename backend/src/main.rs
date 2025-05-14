// src/main.rs

use actix_web::{web, App, HttpServer};
use std::io;
use std::sync::Arc;
use std::path::Path;

mod handlers;
mod models;
mod bio_core;


type SharedFastaData = Arc<Vec<models::bio_data::FastaSequence>>;


#[actix_web::main]
async fn main() -> io::Result<()> {
    println!("--- Loading FASTA Dataset from File ---");

    let dataset_file_path = Path::new("/home/qika/Documents/IF3211_Dataset.fasta");

    let fasta_sequences = bio_core::fasta::parse_fasta_file(dataset_file_path)
        .expect(&format!("Failed to parse FASTA dataset file: {:?}", dataset_file_path));

    println!("Successfully loaded {} sequences from file: {:?}", fasta_sequences.len(), dataset_file_path);
     if let Some(first_seq) = fasta_sequences.first() {
          println!("First sequence ID: {}", first_seq.header_info.primary_id);
          println!("First sequence length: {}", first_seq.sequence.len());
     }
    println!("--- Loading Complete ---");

    let shared_fasta_data: SharedFastaData = Arc::new(fasta_sequences);

    println!("Starting bioinformatics API server at http://127.0.0.1:8080");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(Arc::clone(&shared_fasta_data)))

            .service(handlers::sequence::kmer_search)

    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}