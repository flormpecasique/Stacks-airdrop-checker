async function checkAirdrops() {
    const address = document.getElementById("stacksAddress").value.trim();
    if (!address) {
        alert("Please enter a valid Stacks address.");
        return;
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>Fetching airdrop data...</p>";

    try {
        // Obtener los balances para extraer los contratos de tokens recibidos
        const balanceResponse = await fetch(`https://api.hiro.so/extended/v1/address/${address}/balances`);
        if (!balanceResponse.ok) throw new Error("Failed to fetch balances");
        const balanceData = await balanceResponse.json();

        // Obtener historial de transacciones para verificar estado del airdrop
        const txResponse = await fetch(`https://api.hiro.so/extended/v1/address/${address}/transactions?limit=50`);
        if (!txResponse.ok) throw new Error("Failed to fetch transactions");
        const txData = await txResponse.json();

        let resultHTML = `<h2>Received Airdrops</h2>`;

        if (balanceData.fungible_tokens && Object.keys(balanceData.fungible_tokens).length > 0) {
            resultHTML += `<table>
                <tr>
                    <th>#</th>
                    <th>Airdrop Name</th>
                    <th>Status</th>
                    <th>Received Date</th>
                </tr>`;

            let airdropCount = 0;
            for (const [contract, details] of Object.entries(balanceData.fungible_tokens)) {
                airdropCount++;

                // Extraer el nombre del airdrop desde el contrato
                const airdropName = contract.includes(".") ? contract.split('.')[1] : "Unknown Airdrop";

                // Buscar si hay una transacción de token transfer exitosa para este contrato
                const transaction = txData.results.find(tx => 
                    tx.tx_type === "token_transfer" && 
                    tx.tx_status === "success" && 
                    tx.token_transfer?.contract_id === contract
                );

                // Determinar estado del airdrop
                const status = transaction ? "✔️" : "⏳";
                const receivedDate = transaction ? new Date(transaction.burn_block_time * 1000).toLocaleDateString() : "Pending";
                const txLink = transaction ? `<a href="https://explorer.hiro.so/txid/${transaction.tx_id}" target="_blank">${receivedDate}</a>` : receivedDate;

                resultHTML += `<tr>
                    <td>${airdropCount}</td>
                    <td>${airdropName}</td>
                    <td>${status}</td>
                    <td>${txLink}</td>
                </tr>`;
            }

            resultHTML += `</table>`;
        } else {
            resultHTML += `<p>No airdropped tokens found.</p>`;
        }

        resultsDiv.innerHTML = resultHTML;
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error retrieving data. Please try again.</p>`;
        console.error("Fetch error:", error);
    }
}
