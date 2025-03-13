async function checkAirdrops() {
    const address = document.getElementById("stacksAddress").value.trim();
    if (!address) {
        alert("Por favor, ingresa una dirección válida.");
        return;
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "Buscando airdrops...";

    try {
        const response = await fetch(`https://api.hiro.so/extended/v1/address/${address}/balances`);
        const data = await response.json();

        if (data) {
            let resultHTML = `<h2>Tokens en tu dirección</h2>`;
            resultHTML += `<p><strong>STX:</strong> ${data.stx.balance / 1e6} STX</p>`;

            if (data.fungible_tokens && Object.keys(data.fungible_tokens).length > 0) {
                resultHTML += `<h3>Tokens Recibidos:</h3><ul>`;
                for (const [token, details] of Object.entries(data.fungible_tokens)) {
                    resultHTML += `<li><strong>${token}:</strong> ${details.balance / (10 ** details.decimals)}</li>`;
                }
                resultHTML += `</ul>`;
            } else {
                resultHTML += `<p>No se encontraron tokens en esta dirección.</p>`;
            }

            resultsDiv.innerHTML = resultHTML;
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error al obtener los datos. Intenta de nuevo.</p>`;
    }
}

