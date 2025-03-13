async function checkAirdrops() {
    const address = document.getElementById("stacksAddress").value.trim();
    if (!address) {
        alert("Please enter a valid Stacks address.");
        return;
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>Fetching airdrop data...</p>";

    try {
        const response = await fetch(`https://api.hiro.so/extended/v1/address/${address}/transactions`);
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        let resultHTML = `<h2>Received Airdrops</h2>`;

        if (data.results && data.results.length > 0) {
            resultHTML += `<table>
                <tr>
                    <th>#</th>
                    <th>Airdrop Name</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Link</th>
                </tr>`;

            let airdropCount = 0;
            for (const tx of data.results) {
                if (tx.tx_type === "token_transfer") {
                    airdropCount++;
                    const contractAddress = tx.contract_call?.contract_id || "Unknown Contract";
                    const airdropName = contractAddress.includes(".") ? contractAddress.split('.')[1] : "Unknown Airdrop";
                    const status = tx.tx_status === "success" ? "✔️" : "⏳"; // Check si fue recibido, reloj de arena si está pendiente
                    const amount = tx.token_transfer.amount ? (tx.token_transfer.amount / 1e6).toFixed(6) : "N/A"; // Normalizar la cantidad si está disponible

                    resultHTML += `<tr>
                        <td>${airdropCount}</td>
                        <td>${airdropName}</td>
                        <td>${amount}</td>
                        <td>${status}</td>
                        <td><a href="https://explorer.hiro.so/txid/${tx.tx_id}" target="_blank">View</a></td>
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
