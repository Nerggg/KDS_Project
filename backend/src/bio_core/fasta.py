from pathlib import Path
from typing import List
from models.bio_data import FastaSequence, ParsedHeaderInfo

def parse_fasta_header(header_line: str) -> ParsedHeaderInfo:
    primary_id = header_line
    taxonomy_str = None

    if " " in header_line:
        primary_id, taxonomy_str = header_line.split(" ", 1)
        taxonomy_str = taxonomy_str.strip()

    kingdom = None
    phylum = None
    class_ = None
    order = None
    family = None
    genus = None
    species = None
    other_info = None

    if taxonomy_str:
        parts = [p.strip() for p in taxonomy_str.split(";") if p.strip()]
        if parts:
            kingdom = parts[0] if len(parts) > 0 else None
            phylum = parts[1] if len(parts) > 1 else None
            class_ = parts[2] if len(parts) > 2 else None
            order = parts[3] if len(parts) > 3 else None
            family = parts[4] if len(parts) > 4 else None
            genus = parts[5] if len(parts) > 5 else None
            species = parts[6] if len(parts) > 6 else None
            if len(parts) > 7:
                other_info = ";".join(parts[7:])
            elif len(parts) < 7 and taxonomy_str and not species and len(parts) == 1:
                if parts[0] == taxonomy_str.strip():
                    if not kingdom:
                        other_info = taxonomy_str

    return ParsedHeaderInfo(
        primary_id=primary_id,
        kingdom=kingdom,
        phylum=phylum,
        class_=class_,
        order=order,
        family=family,
        genus=genus,
        species=species,
        other_info=other_info
    )

def parse_fasta_reader(lines) -> List[FastaSequence]:
    sequences = []
    current_header = None
    current_sequence = ""

    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.startswith(">"):
            if current_header:
                sequences.append(FastaSequence(
                    header_info=parse_fasta_header(current_header),
                    sequence=current_sequence
                ))
                current_sequence = ""
            current_header = line[1:]
        else:
            current_sequence += line

    if current_header:
        sequences.append(FastaSequence(
            header_info=parse_fasta_header(current_header),
            sequence=current_sequence
        ))

    return sequences

def parse_fasta_file(path: Path) -> List[FastaSequence]:
    with open(path, "r") as file:
        return parse_fasta_reader(file)
