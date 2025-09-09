(function initDashboard(){
	if (!document.getElementById('keralaMap')) return;

	const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
	const byDistrict = outbreaks.byDistrict || [];

	const map = L.map('keralaMap');
	const keralaCenter = [10.5327, 76.2711];
	map.setView(keralaCenter, 7);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; OpenStreetMap contributors'
	}).addTo(map);

	const diseaseFilter = document.getElementById('diseaseFilter');
	let currentDisease = diseaseFilter ? diseaseFilter.value : 'dengue';
	let markers = [];

	function getColorForCount(c){
		if (c >= 40) return '#dc3545';
		if (c >= 20) return '#E67E22';
		return '#27AE60';
	}

	function renderMarkers(){
		markers.forEach(m => map.removeLayer(m));
		markers = [];
		let activeTotal = 0;
		let highRisk = 0;
		byDistrict.forEach(d => {
			const count = d[currentDisease] || 0;
			activeTotal += count;
			if (count >= 20) highRisk += 1;
			const color = getColorForCount(count);
			const marker = L.circleMarker(d.coords, {
				radius: Math.max(8, Math.min(20, count / 2)),
				color,
				fillColor: color,
				fillOpacity: 0.6,
				weight: 2
			}).addTo(map);
			marker.bindPopup(`<strong>${d.district}</strong><br/>${currentDisease.toUpperCase()}: ${count}`);
			markers.push(marker);
		});
		document.getElementById('activeCases').textContent = activeTotal;
		document.getElementById('newCases').textContent = Math.max(3, Math.round(activeTotal * 0.08));
		document.getElementById('riskAreas').textContent = highRisk;
		renderDistrictTable();
	}

	function renderDistrictTable(){
		const container = document.getElementById('districtTable');
		container.innerHTML = '';
		const header = document.createElement('div');
		header.className = 'row fw-semibold';
		header.innerHTML = '<div class="col">District</div><div class="col text-end">Cases</div>';
		container.appendChild(header);
		byDistrict.slice().sort((a,b) => (b[currentDisease]||0)-(a[currentDisease]||0)).forEach(d => {
			const row = document.createElement('div');
			row.className = 'row';
			row.innerHTML = `<div class="col">${d.district}</div><div class="col text-end">${d[currentDisease]||0}</div>`;
			container.appendChild(row);
		});
	}

	function renderTrends(){
		const ctx = document.getElementById('trendChart');
		if (!ctx) return;
		const t = outbreaks.trends || { weeks: [], dengue: [], malaria: [], tb: [], covid: [] };
		new Chart(ctx, {
			type: 'line',
			data: {
				labels: t.weeks,
				datasets: [
					{ label: 'Dengue', data: t.dengue, borderColor: '#dc3545', tension: .3 },
					{ label: 'Malaria', data: t.malaria, borderColor: '#27AE60', tension: .3 },
					{ label: 'TB', data: t.tb, borderColor: '#1B4F72', tension: .3 },
					{ label: 'COVID-19', data: t.covid, borderColor: '#E67E22', tension: .3 }
				]
			},
			options: { plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
		});
	}

	if (diseaseFilter) {
		diseaseFilter.addEventListener('change', () => { currentDisease = diseaseFilter.value; renderMarkers(); });
	}

	// simulate real-time updates
	setInterval(() => {
		byDistrict.forEach(d => { d[currentDisease] = Math.max(0, (d[currentDisease]||0) + (Math.random() > 0.7 ? 1 : 0)); });
		renderMarkers();
	}, 5000);

	renderMarkers();
	renderTrends();
})();

