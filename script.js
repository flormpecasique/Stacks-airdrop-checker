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

        // Airdrops recibidos
        if (data.transactions && data.transactions.length > 0) {
            resultHTML += `<table>
                <tr>
                    <th>#</th>
                    <th>Airdrop Name</th>
                    <th>Status</th>
                </tr>`;

            let airdropCount = 0;
            for (const tx of data.transactions) {
                if (tx.tx_type === "token_transfer" && tx.token && tx.token.contract) {
                    airdropCount++;
                    const contractAddress = tx.token.contract;
                    const airdropName = contractAddress.split('.')[1];  // Extraemos el nombre del airdrop
                    const status = tx.status === "success" ? "✔️" : "⏳"; // Check o reloj de arena

                    resultHTML += `<tr>
                        <td>${airdropCount}</td>
                        <td><a href="https://explorer.hiro.so/address/${contractAddress}" target="_blank">${airdropName}</a></td>
                        <td>${status}</td>
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
