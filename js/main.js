// Global app helpers for prototype
window.App = (function () {
	const STORAGE_KEYS = {
		language: 'mw_language',
		workers: 'mw_workers',
		providerRole: 'mw_provider_role',
		selectedWorkerId: 'mw_selected_worker',
	};

	function loadSampleDataIfEmpty() {
		try {
			const existing = localStorage.getItem(STORAGE_KEYS.workers);
			if (!existing) {
				fetch('assets/data/sample-data.json')
					.then(r => r.json())
					.then(data => {
						localStorage.setItem(STORAGE_KEYS.workers, JSON.stringify(data.workers));
						localStorage.setItem('mw_outbreaks', JSON.stringify(data.outbreaks));
					})
					.catch(() => {});
			}
		} catch (e) {}
	}

	function showToast(message, type = 'success') {
		let toast = document.querySelector('.app-toast');
		if (!toast) {
			toast = document.createElement('div');
			toast.className = 'app-toast';
			document.body.appendChild(toast);
		}
		toast.style.borderLeftColor = type === 'error' ? '#dc3545' : getComputedStyle(document.documentElement).getPropertyValue('--brand-secondary');
		toast.textContent = message;
		toast.classList.add('show');
		setTimeout(() => toast.classList.remove('show'), 2200);
	}

	function generateHealthId() {
		return 'MW' + Math.floor(100000 + Math.random() * 900000);
	}

	function getWorkers() {
		try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.workers) || '[]'); } catch { return []; }
	}

	function saveWorker(worker) {
		const workers = getWorkers();
		const index = workers.findIndex(w => w.healthId === worker.healthId);
		if (index >= 0) workers[index] = worker; else workers.push(worker);
		localStorage.setItem(STORAGE_KEYS.workers, JSON.stringify(workers));
	}

	function findWorkerById(id) {
		return getWorkers().find(w => w.healthId === id);
	}

	function setSelectedWorker(id) {
		localStorage.setItem(STORAGE_KEYS.selectedWorkerId, id);
	}

	function getSelectedWorker() {
		return localStorage.getItem(STORAGE_KEYS.selectedWorkerId);
	}

	// Initialize sample data on index
	if (document.location.pathname.endsWith('index.html') || document.location.pathname.endsWith('/prototype/') || document.location.pathname.endsWith('/prototype')) {
		loadSampleDataIfEmpty();
	}

	return {
		STORAGE_KEYS,
		showToast,
		generateHealthId,
		getWorkers,
		saveWorker,
		findWorkerById,
		setSelectedWorker,
		getSelectedWorker,
		loadSampleDataIfEmpty
	};
})();

