async function checkAirdrops() {
    const address = document.getElementById('stacksAddress').value.trim();
    if (!address) {
        alert('Please enter a valid Stacks address.');
        return;
    }

    const response = await fetch(`/api/hiro-proxy.js?address=${address}`);
    const data = await response.json();

    let resultsHTML = `<h2>Airdrops Received</h2>`;
    resultsHTML += `<table><tr><th>#</th><th>Token</th><th>Amount</th></tr>`;

    data.forEach((airdrop, index) => {
        resultsHTML += `<tr>
            <td>${index + 1}</td>
            <td>${airdrop.tokenName || "Unknown"}</td>
            <td>${airdrop.amount || "N/A"}</td>
        </tr>`;
    });

    resultsHTML += `</table>`;
    document.getElementById('results').innerHTML = resultsHTML;
}
