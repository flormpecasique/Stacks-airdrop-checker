async function checkAirdrops() {
    const address = document.getElementById("stacksAddress").value.trim();
    if (!address) {
        alert("Please enter a valid Stacks address.");
        return;
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>Fetching airdrop data...</p>";

    try {
        const response = await fetch(`https://stacks-node-api.mainnet.stacks.co/v2/accounts/${address}`);
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        let resultHTML = `<h2>Received Airdrops</h2>`;

        // Mostrar saldo de STX
        if (data.stx && data.stx.balance) {
            resultHTML += `<p><strong>STX:</strong> ${(data.stx.balance / 1e6).toFixed(6)} STX</p>`;
        }

        // Tokens fungibles
        if (data.fungible_tokens && data.fungible_tokens.length > 0) {
            resultHTML += `<table>
                <tr>
                    <th>#</th>
                    <th>Token</th>
                    <th>Amount</th>
                </tr>`;

            let airdropCount = 0;
            for (const token of data.fungible_tokens) {
                airdropCount++;
                const tokenName = token.name; // El nombre del token ya viene en la respuesta
                const balance = token.amount / (10 ** token.decimals); // La cantidad de tokens con su precisión

                // Asegurarse de que la cantidad es válida
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
