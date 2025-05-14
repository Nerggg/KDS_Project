use std::collections::{HashMap, HashSet};
use crate::models::bio_data::{FastaSequence, SimilarityResult};

pub fn calculate_kmer_counts(sequence: &str, k: usize) -> HashMap<String, usize> {
     let mut counts: HashMap<String, usize> = HashMap::new();
    let sequence_upper = sequence.to_uppercase();

    if k == 0 || k > sequence_upper.len() {
        return counts;
    }

    for i in 0..=(sequence_upper.len() - k) {
        let kmer = &sequence_upper[i..i + k];
        *counts.entry(kmer.to_string()).or_insert(0) += 1;
    }

    counts
}

pub fn calculate_jaccard_similarity(counts1: &HashMap<String, usize>, counts2: &HashMap<String, usize>) -> f64 {
    if counts1.is_empty() && counts2.is_empty() { return 1.0; }
    if counts1.is_empty() || counts2.is_empty() { return 0.0; }

    let set1: HashSet<&String> = counts1.keys().collect();
    let set2: HashSet<&String> = counts2.keys().collect();

    let intersection_size = set1.intersection(&set2).count();
    let union_size = set1.union(&set2).count();

    if union_size == 0 { 0.0 } else { intersection_size as f64 / union_size as f64 }
}

pub fn find_top_n_matches(
    query_sequence: &str,
    dataset: &[FastaSequence],
    k: usize,
    n: usize,
) -> Vec<SimilarityResult> {
    let query_kmer_counts = calculate_kmer_counts(query_sequence, k);

    if query_kmer_counts.is_empty() {
        return Vec::new();
    }

    let mut similarity_results: Vec<SimilarityResult> = Vec::new();

    for seq in dataset.iter() {
        let dataset_kmer_counts = calculate_kmer_counts(&seq.sequence, k);
        let score = calculate_jaccard_similarity(&query_kmer_counts, &dataset_kmer_counts);

        similarity_results.push(SimilarityResult {
            header_info: seq.header_info.clone(), 
            sequence: seq.sequence.clone(),       
            similarity_score: score,
        });
    }

    similarity_results.sort_by(|a, b| b.similarity_score.partial_cmp(&a.similarity_score).unwrap());

    similarity_results.into_iter().take(n).collect()
}