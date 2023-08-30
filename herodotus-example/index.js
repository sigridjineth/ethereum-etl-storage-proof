const { ethers } = require("ethers");
const fetch = require("node-fetch");

const RPC_ENDPOINT = 'https://ethereum-goerli-rpc.allthatnode.com';

const proofOfOwnership = async (address, token_id, block_number, mapping_storage_slot) => {
    const tokenIdHex = "0x" + token_id.toString(16).padStart(64, '0');
    console.log('tokenIdHex', tokenIdHex)
    const balance_slot_keccak = ethers.keccak256(
        ethers.concat([
            tokenIdHex,
            mapping_storage_slot
        ])
    );
    return { blockNum: block_number, slot: balance_slot_keccak };
}

const ethGetProof = async (address, slots, blockNumber) => {
    const response = await fetch(RPC_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getProof",
            params: [address, slots, `0x${blockNumber.toString(16)}`],
            id: 1
        })
    });

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message);
    }

    return data.result;
};

const herodotusProof = async (address, blockNum) => {
    const herodotus_endpoint = 'https://api.herodotus.cloud';
    const herodotus_api_key = ''
    const body = {
        originChain: "GOERLI",
        destinationChain: "STARKNET_GOERLI",
        blockNumber: blockNum,
        type: "ACCOUNT_ACCESS",
        requestedProperties: {
            ACCOUNT_ACCESS: {
                account: address,
                properties: ["storageHash"]
            }
        },
    };

    const response = await fetch(herodotus_endpoint + '?apiKey=' + herodotus_api_key, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    return data;
}

const starknetVerify = async (address, slot, blockNum) => {
    const ethProof = await ethGetProof(address, [slot], blockNum);
    const rawProof = ethProof.storageProof[0].proof;
    const proof = rawProof.map(leaf => ethers.getBytes(leaf));
    const flatProofByteLengths = [];
    const flatProofWordLengths = [];
    const flatProofValues = [];

    for (const element of proof) {
        flatProofByteLengths.push(element.length);
        flatProofWordLengths.push(element.length / 32);
        flatProofValues.push(...element);
    }

    const slot_from_hex = ethers.getBytes(slot);
    const output = {
        slot: slot_from_hex,
        proof_sizes_bytes: flatProofByteLengths,
        proof_sizes_words: flatProofWordLengths,
        proofs_concat: flatProofValues
    };

    return output;
}

// Example usage
(async () => {
    const storageData = await proofOfOwnership('0xF250803eb8D6a96434a4a45cC1a1ca6d4eADEcbA', 1, 9609256, '0x000000020000000064efb06454ec3614921c851898d11ce14a8c88d2d00119b2');
    console.log('Storage Data:', storageData);
    const herodotusData = await herodotusProof('0xF250803eb8D6a96434a4a45cC1a1ca6d4eADEcbA', 9609256);
    console.log('Herodotus Data:', herodotusData);
    const starknetData = await starknetVerify('0xF250803eb8D6a96434a4a45cC1a1ca6d4eADEcbA', storageData.slot, 9609256);
    console.log('StarkNet Verification Data:', starknetData);
})();
