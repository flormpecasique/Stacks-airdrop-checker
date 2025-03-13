async function checkAirdrops() {
    const address = document.getElementById("stacksAddress").value.trim();
    if (!address) {
        alert("Please enter a valid Stacks address.");
        return;
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>Searching for airdrops...</p>";

    try {
        // Obtener balances de la API de Hiro usando el proxy seguro en Vercel
        const balancesResponse = await fetch(`/api/hiro-proxy?endpoint=extended/v1/address/${address}/balances`);
        const balancesData = await balancesResponse.json();

        if (!balancesData) {
            resultsDiv.innerHTML = `<p>Error fetching balance data.</p>`;
            return;
        }

        let resultHTML = `<h2>Received Airdrops</h2>`;
        resultHTML += `<p><strong>STX:</strong> ${balancesData.stx.balance / 1e6} STX</p>`;

        if (balancesData.fungible_tokens && Object.keys(balancesData.fungible_tokens).length > 0) {
            let airdropCount = 0;
            resultHTML += `<table>
                <tr>
                    <th>#</th>
                    <th>Token</th>
                    <th>Amount</th>
                </tr>`;

            // Obtener lista de tokens desde StxScan para validar nombres
            const tokenListResponse = await fetch("https://stxscan.co/api/tokens");
            const tokenList = await tokenListResponse.json();

            // Procesar cada token recibido
            const tokens = Object.entries(balancesData.fungible_tokens).map(([contract, details]) => {
                const tokenName = tokenList.find(t => t.contract === contract)?.name || details.symbol || "Unknown";
                const balance = details.balance / (10 ** details.decimals);
                return { tokenName, balance };
            });

            // Ordenar por nombre de token
            tokens.sort((a, b) => a.tokenName.localeCompare(b.tokenName));

            // Generar tabla con resultados
            tokens.forEach(({ tokenName, balance }, index) => {
                resultHTML += `<tr>
                    <td>${index + 1}</td>
                    <td>${tokenName}</td>
                    <td>${balance}</td>
                </tr>`;
            });

            resultHTML += `</table>`;
        } else {
            resultHTML += `<p>No tokens found at this address.</p>`;
        }

        resultsDiv.innerHTML = resultHTML;
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error retrieving data. Please try again.</p>`;
    }
}
