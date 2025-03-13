async function checkAirdrops() {
    const address = document.getElementById("stacksAddress").value.trim();
    if (!address) {
        alert("Please enter a valid Stacks address.");
        return;
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>Fetching airdrop data...</p>";

    try {
        const response = await fetch(`https://api.hiro.so/extended/v1/address/${address}/balances`);
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        let resultHTML = `<h2>Received Airdrops</h2>`;

        // Mostrar saldo de STX
        if (data.stx && data.stx.balance) {
            resultHTML += `<p><strong>STX:</strong> ${(data.stx.balance / 1e6).toFixed(6)} STX</p>`;
        }

        // Tokens fungibles
        if (data.fungible_tokens && Object.keys(data.fungible_tokens).length > 0) {
            resultHTML += `<table>
                <tr>
                    <th>#</th>
                    <th>Token</th>
                    <th>Amount</th>
                </tr>`;

            let airdropCount = 0;
            for (const [contract, details] of Object.entries(data.fungible_tokens)) {
                airdropCount++;

                const tokenName = await getTokenName(contract);
                const balance = details.balance / (10 ** details.decimals);

                // Asegurarnos de que la cantidad es válida
                if (isNaN(balance)) {
                    resultHTML += `<tr>
                        <td>${airdropCount}</td>
                        <td>${tokenName}</td>
                        <td>Invalid Amount</td>
                    </tr>`;
                } else {
                    resultHTML += `<tr>
                        <td>${airdropCount}</td>
                        <td>${tokenName}</td>
                        <td>${balance.toFixed(6)}</td>
                    </tr>`;
                }
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

// Función para obtener el nombre del token usando la API de Hiro
async function getTokenName(contract) {
    try {
        const response = await fetch(`https://api.hiro.so/v1/tokens/${contract}`);
        if (!response.ok) throw new Error("Failed to fetch token data");

        const tokenData = await response.json();

        // Verificamos si la respuesta contiene un nombre válido
        return tokenData.name || "Unknown Token";
    } catch (error) {
        console.error("Error fetching token name:", error);
        return "Unknown Token";
    }
}
