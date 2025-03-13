async function checkAirdrops() {
    const address = document.getElementById("stacksAddress").value.trim();
    if (!address) {
        alert("Por favor, ingresa una dirección válida.");
        return;
    }

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>Buscando airdrops...</p>";

    try {
        // Cambiar la URL para usar el proxy en Vercel
        const response = await fetch(`/api/hiro-proxy?address=${address}`);
        const data = await response.json();

        if (data) {
            let resultHTML = `<h2>Airdrops recibidos</h2>`;
            resultHTML += `<p><strong>STX:</strong> ${data.stx.balance / 1e6} STX</p>`;

            if (data.fungible_tokens && Object.keys(data.fungible_tokens).length > 0) {
                let airdropCount = 0;
                resultHTML += `<table>
                    <tr>
                        <th>#</th>
                        <th>Token</th>
                        <th>Cantidad</th>
                    </tr>`;

                Object.entries(data.fungible_tokens)
                    .sort((a, b) => a[0].localeCompare(b[0])) // Ordenar alfabéticamente
                    .forEach(([tokenAddress, details], index) => {
                        airdropCount++;

                        // Verificamos si el nombre del token existe, si no, mostramos "Desconocido"
                        const tokenName = details?.symbol ? details.symbol : "Desconocido";

                        // Verificamos si los decimales existen y calculamos el balance correctamente
                        const balance = (details?.balance && details?.decimals !== undefined)
                            ? (details.balance / Math.pow(10, details.decimals)).toFixed(6)
                            : "Error";

                        resultHTML += `<tr>
                            <td>${airdropCount}</td>
                            <td>${tokenName}</td>
                            <td>${balance}</td>
                        </tr>`;
                    });

                resultHTML += `</table>`;
            } else {
                resultHTML += `<p>No se encontraron tokens en esta dirección.</p>`;
            }

            resultsDiv.innerHTML = resultHTML;
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error al obtener los datos. Intenta de nuevo.</p>`;
    }
}
