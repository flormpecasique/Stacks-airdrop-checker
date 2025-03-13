// api/hiro-proxy.js
export default async function handler(req, res) {
    const { address } = req.query;
    
    if (!address) {
        return res.status(400).json({ error: "Se requiere una dirección de Stacks." });
    }

    try {
        const response = await fetch(`https://api.hiro.so/extended/v1/address/${address}/balances`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.HIRO_API_KEY}`,
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "No se pudo obtener la información." });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los datos del servidor." });
    }
}
