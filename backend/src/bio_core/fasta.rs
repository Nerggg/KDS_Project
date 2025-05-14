// src/bio_core/fasta.rs

use std::fs::File;
use std::io::{self, BufRead, BufReader};
use std::path::Path;

use crate::models::bio_data::{FastaSequence, ParsedHeaderInfo};

fn parse_fasta_header(header_line: &str) -> ParsedHeaderInfo {
    let primary_id;
    let mut taxonomy_str: Option<&str> = None;

    if let Some(space_index) = header_line.find(' ') {
        primary_id = header_line[..space_index].to_string();
        taxonomy_str = Some(header_line[space_index + 1..].trim());
    } else {
        primary_id = header_line.to_string();
    }

    let mut kingdom = None;
    let mut phylum = None;
    let mut class = None;
    let mut order = None;
    let mut family = None;
    let mut genus = None;
    let mut species = None;
    let mut other_info = None;

    if let Some(tax_str) = taxonomy_str {
        let parts: Vec<&str> = tax_str.split(';').collect();
        kingdom = parts.get(0).map(|s| s.trim().to_string()).filter(|s| !s.is_empty());
        phylum = parts.get(1).map(|s| s.trim().to_string()).filter(|s| !s.is_empty());
        class = parts.get(2).map(|s| s.trim().to_string()).filter(|s| !s.is_empty());
        order = parts.get(3).map(|s| s.trim().to_string()).filter(|s| !s.is_empty());
        family = parts.get(4).map(|s| s.trim().to_string()).filter(|s| !s.is_empty());
        genus = parts.get(5).map(|s| s.trim().to_string()).filter(|s| !s.is_empty());
        species = parts.get(6).map(|s| s.trim().to_string()).filter(|s| !s.is_empty());

        if parts.len() > 7 {
             other_info = Some(parts[7..].join(";").trim().to_string()).filter(|s| !s.is_empty());
        } else if parts.len() < 7 && !tax_str.is_empty() && species.is_none() {
             if let Some(last_part) = parts.last() {
                 if last_part.trim().to_string() == tax_str.trim().to_string() && parts.len() == 1 {
                     if kingdom.is_none() {
                        other_info = taxonomy_str.map(|s| s.to_string()).filter(|s| !s.is_empty());
                     }
                 }
             }
        }
    } else {
    }


    ParsedHeaderInfo {
        primary_id,
        kingdom,
        phylum,
        class,
        order,
        family,
        genus,
        species,
        other_info,
    }
}

fn parse_fasta_reader<R: BufRead>(reader: R) -> io::Result<Vec<FastaSequence>> {
    let mut sequences: Vec<FastaSequence> = Vec::new();
    let mut current_header_line: Option<String> = None;
    let mut current_sequence_string = String::new();

    for line_result in reader.lines() {
        let line = line_result?;
        let line = line.trim();

        if line.is_empty() {
            continue;
        }

        if line.starts_with('>') {
            if let Some(header) = current_header_line.take() {
                 let header_info = parse_fasta_header(&header);
                 sequences.push(FastaSequence {
                     header_info,
                     sequence: current_sequence_string.clone(),
                 });
                 current_sequence_string.clear();
            }
            current_header_line = Some(line[1..].to_string());

        } else {
            current_sequence_string.push_str(line);
        }
    }

    if let Some(header) = current_header_line.take() {
        let header_info = parse_fasta_header(&header);
        sequences.push(FastaSequence {
            header_info,
            sequence: current_sequence_string.clone(),
        });
    }

    Ok(sequences)
}

pub fn parse_fasta_file<P: AsRef<Path>>(path: P) -> io::Result<Vec<FastaSequence>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    parse_fasta_reader(reader)
}