from typing import List, Dict, Set
from models.bio_data import FastaSequence, SimilarityResult

def calculate_kmer_counts(sequence: str, k: int) -> Dict[str, int]:
    counts = {}
    sequence_upper = sequence.upper()

    if k == 0 or k > len(sequence_upper):
        return counts

    for i in range(len(sequence_upper) - k + 1):
        kmer = sequence_upper[i:i + k]
        counts[kmer] = counts.get(kmer, 0) + 1

    return counts

def calculate_jaccard_similarity(counts1: Dict[str, int], counts2: Dict[str, int]) -> float:
    if not counts1 and not counts2:
        return 1.0
    if not counts1 or not counts2:
        return 0.0

    set1 = set(counts1.keys())
    set2 = set(counts2.keys())

    intersection_size = len(set1.intersection(set2))
    union_size = len(set1.union(set2))

    return intersection_size / union_size if union_size != 0 else 0.0

def find_top_n_matches(query_sequence: str, dataset: List[FastaSequence], k: int, n: int) -> List[SimilarityResult]:
    query_kmer_counts = calculate_kmer_counts(query_sequence, k)

    if not query_kmer_counts:
        return []

    similarity_results = []

    for seq in dataset:
        dataset_kmer_counts = calculate_kmer_counts(seq.sequence, k)
        score = calculate_jaccard_similarity(query_kmer_counts, dataset_kmer_counts)
        similarity_results.append(SimilarityResult(
            header_info=seq.header_info,
            sequence=seq.sequence,
            similarity_score=score
        ))

    similarity_results.sort(key=lambda x: x.similarity_score, reverse=True)
    return similarity_results[:n]
