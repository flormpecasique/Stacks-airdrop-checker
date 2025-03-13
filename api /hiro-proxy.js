// api/hiro-proxy.js
export default async function handler(req, res) {
    try {
        const { endpoint } = req.query;
        if (!endpoint) return res.status(400).json({ error: "Missing API endpoint parameter" });

        const response = await fetch(`https://api.hiro.so/${endpoint}`, {
            headers: { "x-api-key": process.env.HIRO_API_KEY }
        });

        if (!response.ok) throw new Error("Hiro API request failed");

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("API Proxy Error:", error);
        res.status(500).json({ error: error.message });
    }
}
