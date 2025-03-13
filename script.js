async function displayTokenInfo(address) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Buscando información de tokens...';

    try {
        const balancesResponse = await fetch(`https://api.hiro.so/extended/v1/address/${address}/balances`);
        if (!balancesResponse.ok) {
            throw new Error('No se pudo obtener la información de balances');
        }
        const balancesData = await balancesResponse.json();

        if (balancesData.fungible_tokens && Object.keys(balancesData.fungible_tokens).length > 0) {
            let resultHTML = '<h2>Airdrops recibidos</h2>';
            resultHTML += '<table><tr><th>#</th><th>Token</th><th>Cantidad</th></tr>';

            let index = 1;
            for (const [contractAddress, tokenInfo] of Object.entries(balancesData.fungible_tokens)) {
                const tokenName = await getTokenName(contractAddress);
                const totalReceived = await getTotalTokensReceived(address, contractAddress);
                const balance = tokenInfo.balance / Math.pow(10, tokenInfo.decimals);
                resultHTML += `<tr><td>${index}</td><td>${tokenName}</td><td>${balance} (Total recibido: ${totalReceived})</td></tr>`;
                index++;
            }

            resultHTML += '</table>';
            resultsDiv.innerHTML = resultHTML;
        } else {
            resultsDiv.innerHTML = '<p>No se encontraron tokens en esta dirección.</p>';
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error al obtener la información: ${error.message}</p>`;
    }
}
