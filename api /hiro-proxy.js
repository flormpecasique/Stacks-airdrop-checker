// api/hiro-proxy.js
export default async function handler(req, res) {
    const { address } = req.query;
    const apiKey = process.env.HIRO_API_KEY; // Asegúrate de configurar tu API key en Vercel

    const response = await fetch(`https://api.hiro.so/extended/v1/address/${address}/balances`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
        },
    });

    if (!response.ok) {
        return res.status(500).json({ error: 'Error al obtener los datos de la API de Hiro.' });
    }

    const data = await response.json();
    res.status(200).json(data);
}

