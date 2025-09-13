// Provider-specific enhancements and helpers
// Uses existing App helpers and localStorage structures

(function initProvider() {
	const STORAGE = {
		recentScans: 'mw_recent_scans',
		clinicalNotes: 'mw_clinical_notes',
	};

	function getRecentScans() {
		try { return JSON.parse(localStorage.getItem(STORAGE.recentScans) || '[]'); } catch { return []; }
	}

	function setRecentScans(scans) {
		localStorage.setItem(STORAGE.recentScans, JSON.stringify(scans.slice(0,5)));
	}

	function addToRecentScans(patientId, success) {
		const workers = App.getWorkers();
		const w = workers.find(x => x.healthId === patientId);
		const entry = {
			id: patientId,
			name: w ? w.name : 'Unknown',
			success: !!success,
			timestamp: new Date().toISOString()
		};
		const list = getRecentScans();
		const updated = [entry, ...list.filter(e => e.id !== patientId)];
		setRecentScans(updated);
	}

	function validateHealthID(id) {
		return /^MW\d{6}$/.test((id||'').trim());
	}

	function updateDashboardStats() {
		const workers = App.getWorkers();
		const total = workers.length;
		const todayStr = new Date().toISOString().slice(0,10);
		let todaysVisits = 0;
		let criticalCases = 0;
		let pendingReports = 0;
		workers.forEach(w => {
			(w.records||[]).forEach(r => { if (r.date === todayStr) todaysVisits += 1; if (r.pending) pendingReports += 1; });
			if (w.status === 'Critical') criticalCases += 1;
		});
		const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val); };
		setText('statTotalPatients', total);
		setText('statTodaysVisits', todaysVisits);
		setText('statCriticalCases', criticalCases);
		setText('statPendingReports', pendingReports);
	}

	function performAdvancedSearch(criteria) {
		// Initialize UserManager to ensure mock data is available
		if (typeof UserManager !== 'undefined') {
			UserManager.initMockUsers();
		}
		
		const workers = UserManager.getAllUsers();
		const uid = (criteria.healthId||'').toUpperCase();
		const name = (criteria.name||'').toLowerCase();
		const state = (criteria.state||'').toLowerCase();
		const results = workers.filter(w => {
			const matchId = !uid || (w.healthId||'').toUpperCase().startsWith(uid);
			const matchName = !name || (w.name||'').toLowerCase().includes(name);
			const matchState = !state || (w.homeState||'').toLowerCase() === state;
			return matchId && matchName && matchState;
		});
		const container = document.getElementById('searchResults');
		if (!container) return results;
		container.innerHTML = '';
		if (results.length === 0) {
			container.innerHTML = '<div class="text-muted">No matching patients</div>';
			return results;
		}
		results.slice(0, 25).forEach(w => {
			const item = document.createElement('div');
			item.className = 'card border-0 shadow-sm p-2 mb-2';
			item.innerHTML = `<div class="d-flex justify-content-between align-items-center">
				<div>
					<div class="fw-semibold">${w.name}</div>
					<div class="small text-muted">${w.healthId} • ${w.homeState||'—'}</div>
				</div>
				<a class="btn btn-sm btn-outline-primary" href="./patient-record.html?id=${w.healthId}">Open</a>
			</div>`;
			container.appendChild(item);
		});
		return results;
	}

	function showEmergencyRegistration() {
		const modal = document.getElementById('emergencyModal');
		if (!modal) return;
		const form = modal.querySelector('form');
		if (!form._bound) {
			form.addEventListener('submit', (e) => {
				e.preventDefault();
				if (!form.checkValidity()) { form.classList.add('was-validated'); App.showToast('Please complete required fields', 'error'); return; }
				const fd = new FormData(form);
				const newId = App.generateHealthId();
				const worker = {
					healthId: newId,
					name: fd.get('name'),
					gender: fd.get('gender')||'—',
					age: parseInt(fd.get('age')||'0',10),
					homeState: fd.get('state')||'—',
					status: 'Critical',
					records: [{ date: new Date().toISOString().slice(0,10), diagnosis: 'Emergency Admission', symptoms: fd.get('complaint')||'—', treatment: 'Stabilization' }]
				};
				App.saveWorker(worker);
				App.showToast('Emergency case registered');
				const closeBtn = modal.querySelector('[data-bs-dismiss="modal"]');
				if (closeBtn) closeBtn.click();
				setTimeout(()=>{ window.location.href = `./patient-record.html?id=${newId}`; }, 400);
			});
			form._bound = true;
		}
		// show via bootstrap
		if (window.bootstrap) {
			new bootstrap.Modal(modal).show();
		}
	}

	function simulateAdvancedScan(inputId, options = {}) {
		const btn = document.getElementById('scanBtn');
		const box = document.getElementById('scannerArea');
		if (btn) btn.disabled = true;
		if (box) box.classList.add('scanning-animation');
		return new Promise(resolve => {
			setTimeout(() => {
				if (box) box.classList.remove('scanning-animation');
				if (btn) btn.disabled = false;
				const id = (document.getElementById(inputId)?.value||'').trim() || App.getSelectedWorker();
				const ok = validateHealthID(id) && !!App.findWorkerById(id);
				addToRecentScans(id, ok);
				resolve({ id, ok });
			}, 3000);
		});
	}

	function displayRecentScans(containerId) {
		const container = document.getElementById(containerId);
		if (!container) return;
		const scans = getRecentScans();
		container.innerHTML = '';
		if (scans.length === 0) { container.innerHTML = '<li class="list-group-item">No recent scans</li>'; return; }
		scans.forEach(s => {
			const li = document.createElement('li');
			li.className = 'list-group-item d-flex justify-content-between align-items-center';
			const when = new Date(s.timestamp).toLocaleString();
			li.innerHTML = `<span>${s.name} <span class="text-muted small">(${s.id}) • ${when}</span></span>
				<a class="btn btn-sm ${s.success ? 'btn-outline-primary' : 'btn-outline-secondary'}" href="${s.success ? './patient-record.html?id='+s.id : '#'}">${s.success ? 'Open' : 'Failed'}</a>`;
			container.appendChild(li);
		});
	}

	function getScanStats() {
		const scans = getRecentScans();
		const total = scans.length;
		const success = scans.filter(s => s.success).length;
		return { total, success, failed: total - success };
	}

	function displayTimelineRecords(containerId, records) {
		const container = document.getElementById(containerId);
		if (!container) return;
		container.innerHTML = '';
		const sorted = (records||[]).slice().sort((a,b) => (a.date||'').localeCompare(b.date||''));
		if (sorted.length === 0) { container.innerHTML = '<div class="text-muted">No records yet</div>'; return; }
		const timeline = document.createElement('div');
		timeline.className = 'medical-timeline';
		sorted.forEach(r => {
			const item = document.createElement('div');
			item.className = 'timeline-item card-elevated';
			item.innerHTML = `
				<div class="timeline-marker"></div>
				<div class="timeline-content">
					<div class="small text-muted">${r.date||'—'} ${r.time?('• '+r.time):''}</div>
					<div class="fw-semibold">${r.visitType||'Consultation'}: ${r.diagnosis||'—'}</div>
					<div class="small text-muted">${r.symptoms||''}</div>
					<div class="small">Tx: ${r.treatment||'—'}</div>
				</div>`;
			timeline.appendChild(item);
		});
		container.appendChild(timeline);
	}

	function saveEnhancedRecord(worker, data) {
		const record = {
			date: data.date || new Date().toISOString().slice(0,10),
			time: data.time || '',
			visitType: data.visitType || 'Consultation',
			symptoms: data.chiefComplaint || data.symptoms || '',
			diagnosis: data.diagnosis || '',
			treatment: data.treatment || '',
			prescription: data.prescription || '',
			vitals: {
				bp: data.bp||'', temp: data.temp||'', hr: data.hr||'', weight: data.weight||''
			}
		};
		worker.records = worker.records || [];
		worker.records.push(record);
		App.saveWorker(worker);
		return record;
	}

	function scheduleAppointment(worker, payload) {
		worker.nextAppointment = { date: payload.date, time: payload.time, notes: payload.notes||'' };
		App.saveWorker(worker);
	}

	function generateMedicalReport(worker) {
		const doc = {
			id: worker.healthId,
			name: worker.name,
			gender: worker.gender,
			age: worker.age,
			state: worker.homeState,
			records: worker.records || []
		};
		const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url; a.download = `${worker.healthId}-report.json`; a.click();
		URL.revokeObjectURL(url);
	}

	// expose
	window.Provider = {
		STORAGE,
		addToRecentScans,
		validateHealthID,
		updateDashboardStats,
		performAdvancedSearch,
		showEmergencyRegistration,
		simulateAdvancedScan,
		displayRecentScans,
		getScanStats,
		displayTimelineRecords,
		saveEnhancedRecord,
		scheduleAppointment,
		generateMedicalReport
	};
})();


