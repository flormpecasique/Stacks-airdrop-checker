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

        let resultHTML = `<h2>Received Airdrops</h2>`;

        if (balanceData.fungible_tokens && Object.keys(balanceData.fungible_tokens).length > 0) {
            resultHTML += `<table>
                <tr>
                    <th>#</th>
                    <th>Airdrop Name</th>
                    <th>Status</th>
                </tr>`;

            let airdropCount = 0;
            for (const contract of Object.keys(balanceData.fungible_tokens)) {
                airdropCount++;

                // Extraer el nombre del airdrop desde el contrato
                const airdropName = contract.includes(".") ? contract.split('.')[1] : "Unknown Airdrop";
                const contractLink = `https://explorer.hiro.so/txid/${contract}`;

                resultHTML += `<tr>
                    <td>${airdropCount}</td>
                    <td><a href="${contractLink}" target="_blank">${airdropName}</a></td>
                    <td>✔️</td>
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

