
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const query = req.query.q;
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${accessKey}`;
  try {
    const result = await fetch(apiUrl);
    const json = await result.json();

    if (!json.results || !json.results[0]) {
      return res.status(404).json({ error: "No images found" });
    }

    const img = json.results[0];
    return res.json({
      name: query,
      image: img.urls.regular,
      thumb: img.urls.thumb,
      alt: img.alt_description || '',
      author: img.user?.name || 'Unknown'
    });

  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
}
