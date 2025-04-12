export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  const list = req.body.list;
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!Array.isArray(list)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const results = await Promise.all(
    list.map(async (item) => {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(item.query)}&per_page=1&client_id=${accessKey}`;
      try {
        const apiRes = await fetch(url);
        const data = await apiRes.json();
        const img = data.results?.[0];
        if (!img) return null;

        return {
          name: item.name,
          image: img.urls.regular,
          thumb: img.urls.thumb,
          alt: img.alt_description,
          author: img.user?.name,
        };
      } catch (e) {
        return null;
      }
    })
  );

  res.status(200).json(results.filter(Boolean));
}
