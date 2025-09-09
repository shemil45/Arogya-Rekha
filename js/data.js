// Helper to resolve asset path irrespective of nested pages
(function ensureDataAvailability () {
	try {
		const pathDepth = (window.location.pathname.match(/\//g) || []).length;
		// crude heuristic: try both relative paths
		const tryPaths = [
			'../assets/data/sample-data.json',
			'../../assets/data/sample-data.json',
			'./assets/data/sample-data.json'
		];
		let loaded = false;
		for (const p of tryPaths) {
			if (loaded) break;
			fetch(p).then(r => {
				if (r.ok) return r.json();
				throw new Error('not ok');
			}).then(data => {
				if (!localStorage.getItem('mw_workers')) {
					localStorage.setItem('mw_workers', JSON.stringify(data.workers));
				}
				if (!localStorage.getItem('mw_outbreaks')) {
					localStorage.setItem('mw_outbreaks', JSON.stringify(data.outbreaks));
				}
				loaded = true;
			}).catch(() => {});
		}
	} catch (e) {}
})();

