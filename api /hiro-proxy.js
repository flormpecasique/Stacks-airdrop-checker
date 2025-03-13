export default async function handler(req, res) {
    const { address } = req.query;  // Obtenemos la dirección de la query
    const apiKey = process.env.HIRO_API_KEY;  // me aseguro de haber configurado la clave API en Vercel

    try {
        const response = await fetch(`https://api.hiro.so/extended/v1/address/${address}/balances`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al contactar con la API de Hiro');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);  // Esto se imprimirá en los logs de Vercel
        res.status(500).json({ error: 'Error al obtener los datos de la API de Hiro.' });
    }
}
