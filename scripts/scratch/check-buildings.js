const http = require('http');

http.get('http://localhost:3000/api/buildings', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Total buildings in DB:', parsed.length);
      parsed.forEach(b => {
        console.log(`Building: ${b.name} (${b.id}) - Floors: ${b.floorsCount} - Rooms count: ${b.rooms?.length}`);
        console.log('Rooms:', (b.rooms || []).map(r => `${r.name} (${r.code})`).join(', '));
      });
    } catch (e) {
      console.log('Error parsing JSON:', e.message);
      console.log('Raw Data:', data);
    }
  });
}).on('error', (err) => {
  console.log('Fetch error:', err.message);
});
