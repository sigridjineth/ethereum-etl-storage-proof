# ESP: Verifiable On-chain ETL Pipeline with Storage Proof

## Problems

* The advent of tools like [Cryo](https://github.com/paradigmxyz/cryo) from Paradigm simplifies the extraction of blockchain data to various formats such as parquet, csv, json, and even directly to python dataframes.
* On-chain data is essential, but often there is a need to access this data off-chain, particularly for ETL (Extract, Transform, Load) data pipelines. This results in several data marketplaces emerging, where data, stored in formats like parquet in platforms like s3, is being sold.
* One major concern is the validity of this on-chain data when accessed off-chain. Without verification, one cannot be sure of the integrity and authenticity of the data, which can be detrimental when this data is integrated into data pipelines built on platforms like Spark or Arrow.

## Approach

* To solidify the trust in on-chain data accessed off-chain, we propose appending the extracted data files with additional files that encompass proofs of the original data. Taking inspiration from StarkNet Verification Data, these additional files should contain proof data such as slot, proof_sizes_bytes, proof_sizes_words, and proofs_concat.
* As an example, if one uses Cryo to extract all USDC events using the command:
  ```
  cryo logs --contract 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
  ```
  Alongside the primary event data in parquet format, there should be supplementary parquet files structured similarly to StarkNet Verification Data from Herodotus or other approaches (e.g. utilzing plonk2x). These can be instrumental in validating the integrity and authenticity of the primary data.

## Accomplishment & Scope

* An initial idea has been conceptualized and knowledge about the storage proof and Herodotus has been acquired during the Starknet hackerhouse '23 event. Big shoutout to Pia for the insights.
* **poc step1 scope**: Develop a proof-of-concept where for each extraction using Cryo, additional proof data is also generated. This will involve integrating the proof generation logic into the extraction process and ensuring that the output is in the desired format (e.g., parquet).
* **poc step2 scope**: Develop a verification tool or utility that can take these proof files and the original data to verify their authenticity. This tool should be able to flag any discrepancies or tampering in the data and make the entire ETL process more robust and trustworthy.

This structure provides an overview of the problem, the proposed solution, and the steps taken or planned to achieve the solution.