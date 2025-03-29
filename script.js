async function checkAirdrops() {
    let input = document.getElementById("stacksAddress").value.trim();
    if (!input) {
        alert("Please enter a valid Stacks address or BNS name.");
        return;
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>Fetching airdrop data...</p>";

    try {
        // Si el input contiene un ".", asumimos que es un nombre BNS y lo convertimos a minúsculas
        if (input.includes(".")) {
            input = input.toLowerCase(); // Convertimos el BNS a minúsculas para evitar errores

            const bnsResponse = await fetch(`https://api.hiro.so/v1/names/${input}`);
            if (!bnsResponse.ok) throw new Error("Failed to fetch BNS data");
            const bnsData = await bnsResponse.json();

            if (!bnsData.address) {
                resultsDiv.innerHTML = `<p>Invalid BNS name. Please try again.</p>`;
                return;
            }
            input = bnsData.address; // Convertimos el BNS a su dirección STX
        }

        // Obtener los balances de la dirección STX
        const balanceResponse = await fetch(`https://api.hiro.so/extended/v1/address/${input}/balances`);
        if (!balanceResponse.ok) throw new Error("Failed to fetch balances");
        const balanceData = await balanceResponse.json();

        let resultHTML = `<h2>Received Airdrops</h2>`;

        if (balanceData.fungible_tokens && Object.keys(balanceData.fungible_tokens).length > 0) {
            resultHTML += `<table>
                <tr>
                    <th>#</th>
                    <th>Airdrop Name</th>
                    <th>Token Name</th>
                    <th>Status</th>
                </tr>`;

            let airdropCount = 0;
            for (const contract of Object.keys(balanceData.fungible_tokens)) {
                airdropCount++;

                // Extraer el nombre del airdrop y el token
                const airdropName = contract.includes(".") ? contract.split('.')[1].split("::")[0] : "Unknown Airdrop";
                const tokenName = contract.includes("::") ? contract.split("::")[1] : "Unknown Token";

                // Generar la URL del contrato sin la parte "::" y el nombre del token
                const contractLink = `https://explorer.hiro.so/address/${contract.split("::")[0]}`;

                resultHTML += `<tr>
                    <td>${airdropCount}</td>
                    <td><a href="${contractLink}" target="_blank">${airdropName}</a></td>
                    <td>${tokenName}</td>
                    <td>✅</td>
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
