(function initDashboard(){
	if (!document.getElementById('keralaMap')) return;

	// Load sample data if not present
	let outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
	if (!outbreaks.byDistrict || outbreaks.byDistrict.length === 0) {
		// Load from sample data
		fetch('../../assets/data/sample-data.json')
			.then(response => response.json())
			.then(data => {
				outbreaks = data.outbreaks;
				localStorage.setItem('mw_outbreaks', JSON.stringify(outbreaks));
				initializeMap();
			})
			.catch(() => {
				// Fallback data if fetch fails
				outbreaks = {
					byDistrict: [
						{ "district": "Thiruvananthapuram", "coords": [8.5241, 76.9366], "dengue": 42, "malaria": 5, "tb": 2, "covid": 18 },
						{ "district": "Ernakulam", "coords": [9.9816, 76.2999], "dengue": 31, "malaria": 3, "tb": 4, "covid": 12 },
						{ "district": "Kozhikode", "coords": [11.2588, 75.7804], "dengue": 27, "malaria": 6, "tb": 3, "covid": 9 },
						{ "district": "Malappuram", "coords": [11.0500, 76.0700], "dengue": 18, "malaria": 2, "tb": 1, "covid": 6 },
						{ "district": "Palakkad", "coords": [10.7867, 76.6548], "dengue": 22, "malaria": 4, "tb": 2, "covid": 8 }
					],
					trends: {
						weeks: ["W1", "W2", "W3", "W4"],
						dengue: [60, 72, 65, 80],
						malaria: [14, 12, 17, 15],
						tb: [7, 6, 9, 8],
						covid: [30, 26, 28, 34]
					}
				};
				localStorage.setItem('mw_outbreaks', JSON.stringify(outbreaks));
				initializeMap();
			});
	} else {
		initializeMap();
	}

	function initializeMap() {
		const byDistrict = outbreaks.byDistrict || [];

		const map = L.map('keralaMap');
		const keralaCenter = [10.5327, 76.2711];
		map.setView(keralaCenter, 7);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap contributors'
		}).addTo(map);

		// Make map globally accessible
		window.map = map;

		const diseaseFilter = document.getElementById('diseaseFilter');
		const refreshBtn = document.getElementById('refreshBtn');
		const exportBtn = document.getElementById('exportBtn');
		let currentDisease = diseaseFilter ? diseaseFilter.value : 'dengue';
		let markers = [];
		let previousData = {}; // Store previous data for comparison

		function getColorForCount(c){
			if (c >= 40) return '#dc3545'; // Red - Critical
			if (c >= 20) return '#E67E22'; // Orange - High
			if (c >= 10) return '#f39c12'; // Yellow - Medium
			return '#27AE60'; // Green - Low
		}

		function getRiskLevel(count) {
			if (count >= 40) return { level: 'CRITICAL', color: 'danger', icon: '🚨' };
			if (count >= 20) return { level: 'HIGH', color: 'warning', icon: '⚠️' };
			if (count >= 10) return { level: 'MEDIUM', color: 'info', icon: '⚡' };
			return { level: 'LOW', color: 'success', icon: '✅' };
		}

		function renderMarkers(){
			markers.forEach(m => map.removeLayer(m));
			markers = [];
			let activeTotal = 0;
			let highRisk = 0;
			let criticalAreas = [];
			
			byDistrict.forEach(d => {
				const count = d[currentDisease] || 0;
				activeTotal += count;
				if (count >= 20) highRisk += 1;
				if (count >= 40) criticalAreas.push(d.district);
				
				const color = getColorForCount(count);
				const risk = getRiskLevel(count);
				
				// Create custom icon with count
				const icon = L.divIcon({
					className: 'custom-marker',
					html: `
						<div style="
							background: ${color};
							border: 2px solid white;
							border-radius: 50%;
							width: ${Math.max(30, Math.min(60, count / 2 + 20))}px;
							height: ${Math.max(30, Math.min(60, count / 2 + 20))}px;
							display: flex;
							align-items: center;
							justify-content: center;
							color: white;
							font-weight: bold;
							font-size: 12px;
							box-shadow: 0 2px 4px rgba(0,0,0,0.3);
						">
							${count}
						</div>
					`,
					iconSize: [Math.max(30, Math.min(60, count / 2 + 20)), Math.max(30, Math.min(60, count / 2 + 20))],
					iconAnchor: [Math.max(15, Math.min(30, count / 4 + 10)), Math.max(15, Math.min(30, count / 4 + 10))]
				});
				
				const marker = L.marker(d.coords, { icon: icon }).addTo(map);
				
				// Enhanced popup with comprehensive details
				const popupContent = `
					<div style="min-width: 200px; text-align: center;">
						<h6 style="margin: 0 0 10px 0; color: #1B4F72;">${d.district}</h6>
						<div style="margin-bottom: 10px;">
							<span class="badge bg-${risk.color}" style="font-size: 14px;">
								${risk.icon} ${currentDisease.toUpperCase()}: ${count} cases
							</span>
						</div>
						<div style="margin-bottom: 10px;">
							<strong>Risk Level: ${risk.level}</strong>
						</div>
						<hr style="margin: 10px 0;">
						<div style="font-size: 12px; text-align: left;">
							<strong>All Diseases:</strong><br/>
							🦟 Dengue: ${d.dengue || 0}<br/>
							🦟 Malaria: ${d.malaria || 0}<br/>
							🫁 TB: ${d.tb || 0}<br/>
							🦠 COVID-19: ${d.covid || 0}
						</div>
						<hr style="margin: 10px 0;">
						<div style="font-size: 11px; color: #666;">
							Coordinates: ${d.coords[0].toFixed(4)}, ${d.coords[1].toFixed(4)}
						</div>
					</div>
				`;
				marker.bindPopup(popupContent);
				markers.push(marker);
			});
			
			// Update statistics with enhanced data
			updateStatistics(activeTotal, highRisk, criticalAreas);
			renderDistrictTable();
			renderAlerts(criticalAreas);
		}
	
	function updateStatistics(activeTotal, highRisk, criticalAreas) {
		document.getElementById('activeCases').textContent = activeTotal;
		document.getElementById('newCases').textContent = Math.max(3, Math.round(activeTotal * 0.08));
		document.getElementById('riskAreas').textContent = highRisk;
		
		// Calculate percentage changes (simulated)
		const activeChange = Math.round(Math.random() * 20 - 10); // -10% to +10%
		const newChange = Math.round(Math.random() * 30 - 15); // -15% to +15%
		
		document.getElementById('activeCasesChange').textContent = 
			`${activeChange > 0 ? '+' : ''}${activeChange}% from last week`;
		document.getElementById('newCasesChange').textContent = 
			`${newChange > 0 ? '+' : ''}${newChange}% from yesterday`;
		document.getElementById('riskAreasChange').textContent = 
			`${criticalAreas.length} districts on alert`;
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

	// New function to render alerts
	function renderAlerts(criticalAreas) {
		const container = document.getElementById('alertsContainer');
		if (!container) return;
		
		container.innerHTML = '';
		
		if (criticalAreas.length > 0) {
			criticalAreas.forEach(area => {
				const alert = document.createElement('div');
				alert.className = 'alert alert-danger d-flex justify-content-between align-items-center';
				alert.innerHTML = `
					<div>
						<strong>🚨 Critical Alert:</strong> ${area} district has high ${currentDisease} cases
					</div>
					<div class="btn-group">
						<button class="btn btn-sm btn-outline-danger" onclick="viewDistrictDetails('${area}')">View Details</button>
						<button class="btn btn-sm btn-danger" onclick="sendAlertToOrganizations('${area}')">📢 Send Alert</button>
					</div>
				`;
				container.appendChild(alert);
			});
			
			// Add notification button for all critical areas
			const notifyAllBtn = document.createElement('div');
			notifyAllBtn.className = 'alert alert-warning d-flex justify-content-between align-items-center mt-2';
			notifyAllBtn.innerHTML = `
				<div>
					<strong>📢 Notify All Health Organizations</strong>
				</div>
				<button class="btn btn-warning btn-sm" onclick="sendBulkAlert()">Send Bulk Alert</button>
			`;
			container.appendChild(notifyAllBtn);
		} else {
			const noAlert = document.createElement('div');
			noAlert.className = 'alert alert-success';
			noAlert.innerHTML = '✅ No critical alerts at this time';
			container.appendChild(noAlert);
		}
	}
	
	// Notification system functions
	function showNotification(message, type = 'info') {
		// Create notification element
		const notification = document.createElement('div');
		notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
		notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
		notification.innerHTML = `
			${message}
			<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
		`;
		
		document.body.appendChild(notification);
		
		// Auto remove after 5 seconds
		setTimeout(() => {
			if (notification.parentNode) {
				notification.remove();
			}
		}, 5000);
	}
	
	// Send alert to health organizations
	function sendAlertToOrganizations(district) {
		const cases = byDistrict.find(d => d.district === district)?.[currentDisease] || 0;
		
		// Simulate sending alert to health organizations
		const alertData = {
			district: district,
			disease: currentDisease,
			cases: cases,
			riskLevel: cases >= 40 ? 'CRITICAL' : 'HIGH',
			timestamp: new Date().toISOString(),
			organizations: [
				'Kerala Health Department',
				'District Medical Office',
				'Local Hospitals',
				'Emergency Response Team',
				'Public Health Centers'
			]
		};
		
		// Show confirmation dialog
		const confirmed = confirm(`
🚨 SEND CRITICAL ALERT

District: ${district}
Disease: ${currentDisease.toUpperCase()}
Cases: ${cases}
Risk Level: ${alertData.riskLevel}

This will notify:
• Kerala Health Department
• District Medical Office  
• Local Hospitals
• Emergency Response Team
• Public Health Centers

Send alert now?
		`);
		
		if (confirmed) {
			// Simulate API call
			setTimeout(() => {
				showNotification(`Alert sent to all health organizations for ${district}`, 'success');
				
				// Log the alert
				const alerts = JSON.parse(localStorage.getItem('health_alerts') || '[]');
				alerts.push(alertData);
				localStorage.setItem('health_alerts', JSON.stringify(alerts));
			}, 1000);
		}
	}
	
	// Send bulk alert for all critical areas
	function sendBulkAlert() {
		const criticalAreas = byDistrict.filter(d => (d[currentDisease] || 0) >= 40);
		
		if (criticalAreas.length === 0) {
			showNotification('No critical areas to alert', 'warning');
			return;
		}
		
		const confirmed = confirm(`
📢 SEND BULK ALERT

Critical Districts: ${criticalAreas.length}
Disease: ${currentDisease.toUpperCase()}

This will send alerts for:
${criticalAreas.map(d => `• ${d.district}: ${d[currentDisease]} cases`).join('\n')}

Send bulk alert to all health organizations?
		`);
		
		if (confirmed) {
			criticalAreas.forEach((area, index) => {
				setTimeout(() => {
					sendAlertToOrganizations(area.district);
				}, index * 500); // Stagger the alerts
			});
			
			setTimeout(() => {
				showNotification(`Bulk alert sent for ${criticalAreas.length} districts`, 'success');
			}, criticalAreas.length * 500 + 1000);
		}
	}
	
	// View district details
	function viewDistrictDetails(district) {
		const districtData = byDistrict.find(d => d.district === district);
		if (!districtData) return;
		
		const cases = districtData[currentDisease] || 0;
		const riskLevel = cases >= 40 ? 'CRITICAL' : cases >= 20 ? 'HIGH' : 'LOW';
		
		alert(`
🏥 DISTRICT DETAILS

District: ${district}
Disease: ${currentDisease.toUpperCase()}
Active Cases: ${cases}
Risk Level: ${riskLevel}
Coordinates: ${districtData.coords[0]}, ${districtData.coords[1]}

All Diseases:
• Dengue: ${districtData.dengue || 0}
• Malaria: ${districtData.malaria || 0}
• TB: ${districtData.tb || 0}
• COVID-19: ${districtData.covid || 0}

Last Updated: ${new Date().toLocaleString()}
		`);
	}
	
	// Export functionality with better formatting
	function exportData() {
		const totalCases = byDistrict.reduce((sum, d) => sum + (d[currentDisease] || 0), 0);
		const highRiskDistricts = byDistrict.filter(d => (d[currentDisease] || 0) >= 20);
		const criticalDistricts = byDistrict.filter(d => (d[currentDisease] || 0) >= 40);
		
		// Create formatted report
		const report = `
KERALA HEALTH DASHBOARD - DISEASE REPORT
========================================

Report Generated: ${new Date().toLocaleString()}
Disease Type: ${currentDisease.toUpperCase()}
Total Active Cases: ${totalCases}

EXECUTIVE SUMMARY
----------------
• Total Active Cases: ${totalCases}
• High Risk Districts (≥20 cases): ${highRiskDistricts.length}
• Critical Districts (≥40 cases): ${criticalDistricts.length}
• Total Districts Monitored: ${byDistrict.length}

DISTRICT BREAKDOWN
------------------
${byDistrict
	.sort((a, b) => (b[currentDisease] || 0) - (a[currentDisease] || 0))
	.map(d => {
		const cases = d[currentDisease] || 0;
		const risk = cases >= 40 ? 'CRITICAL' : cases >= 20 ? 'HIGH' : 'LOW';
		return `${d.district.padEnd(20)} | ${cases.toString().padStart(3)} cases | ${risk}`;
	})
	.join('\n')}

HIGH RISK AREAS
---------------
${highRiskDistricts.length > 0 ? 
	highRiskDistricts.map(d => `• ${d.district}: ${d[currentDisease]} cases`).join('\n') : 
	'No high risk areas identified'}

CRITICAL ALERTS
---------------
${criticalDistricts.length > 0 ? 
	criticalDistricts.map(d => `🚨 ${d.district}: ${d[currentDisease]} cases - IMMEDIATE ACTION REQUIRED`).join('\n') : 
	'No critical alerts at this time'}

RECOMMENDATIONS
---------------
${criticalDistricts.length > 0 ? 
	'• Deploy emergency response teams to critical districts\n• Increase medical supplies and personnel\n• Implement containment measures' : 
	highRiskDistricts.length > 0 ? 
	'• Monitor high risk districts closely\n• Prepare contingency plans\n• Increase surveillance' : 
	'• Continue routine monitoring\n• Maintain current prevention measures'}

---
Report generated by Arogya Rekha Health Dashboard
For official use only
		`.trim();
		
		// Create and download file
		const blob = new Blob([report], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `Kerala-${currentDisease}-Health-Report-${new Date().toISOString().split('T')[0]}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		
		// Show success message
		showNotification('Report exported successfully!', 'success');
	}

	// Event listeners
	if (diseaseFilter) {
		diseaseFilter.addEventListener('change', () => { 
			currentDisease = diseaseFilter.value; 
			renderMarkers(); 
		});
	}
	
	if (refreshBtn) {
		refreshBtn.addEventListener('click', () => {
			// Simulate data refresh
			byDistrict.forEach(d => {
				d[currentDisease] = Math.max(0, (d[currentDisease] || 0) + Math.floor(Math.random() * 5) - 2);
			});
			renderMarkers();
			
			// Show refresh feedback
			refreshBtn.innerHTML = '✅ Refreshed';
			setTimeout(() => {
				refreshBtn.innerHTML = '🔄 Refresh';
			}, 2000);
		});
	}
	
	if (exportBtn) {
		exportBtn.addEventListener('click', exportData);
	}
	

	// Enhanced real-time updates with more realistic simulation
	setInterval(() => {
		byDistrict.forEach(d => { 
			const current = d[currentDisease] || 0;
			const change = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
			d[currentDisease] = Math.max(0, current + change);
		});
		renderMarkers();
	}, 5000);


		// Initialize dashboard
		renderMarkers();
		renderTrends();
		updateRecentAlerts();
	}
})();

// Global navigation functions (accessible from HTML onclick)
function showSection(sectionName) {
	// Hide all sections
	const sections = document.querySelectorAll('.dashboard-section');
	sections.forEach(section => {
		section.style.display = 'none';
	});
	
	// Remove active class from all buttons
	const buttons = document.querySelectorAll('.btn-group .btn');
	buttons.forEach(btn => {
		btn.classList.remove('active', 'btn-primary');
		btn.classList.add('btn-outline-primary');
	});
	
	// Show selected section
	const targetSection = document.getElementById(sectionName + 'Section');
	if (targetSection) {
		targetSection.style.display = 'block';
	}
	
	// Activate corresponding button
	const targetButton = document.getElementById(sectionName + 'Btn');
	if (targetButton) {
		targetButton.classList.remove('btn-outline-primary');
		targetButton.classList.add('active', 'btn-primary');
	}
	
	// Re-render components when switching to their sections
	if (sectionName === 'map') {
		// Re-render map if needed
		setTimeout(() => {
			if (window.map) {
				window.map.invalidateSize();
			}
		}, 100);
	} else if (sectionName === 'graph') {
		// Re-render chart if needed
		setTimeout(() => {
			window.renderTrends();
		}, 100);
	} else if (sectionName === 'alerts') {
		// Re-render alerts
		setTimeout(() => {
			const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
			const byDistrict = outbreaks.byDistrict || [];
			const diseaseFilter = document.getElementById('diseaseFilter');
			const currentDisease = diseaseFilter ? diseaseFilter.value : 'dengue';
			const criticalAreas = byDistrict.filter(d => (d[currentDisease] || 0) >= 40).map(d => d.district);
			
			window.renderAlerts(criticalAreas);
		}, 100);
	} else if (sectionName === 'reports') {
		// Re-render district table for reports
		setTimeout(() => {
			window.renderDistrictTable();
		}, 100);
	} else if (sectionName === 'overview') {
		// Update recent alerts in overview
		setTimeout(() => {
			window.updateRecentAlerts();
			window.updateOverviewStats();
		}, 100);
	}
}

// Update recent alerts for overview section
function updateRecentAlerts() {
	const recentAlertsContainer = document.getElementById('recentAlerts');
	if (!recentAlertsContainer) return;
	
	const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
	const byDistrict = outbreaks.byDistrict || [];
	const diseaseFilter = document.getElementById('diseaseFilter');
	const currentDisease = diseaseFilter ? diseaseFilter.value : 'dengue';
	
	const criticalAreas = byDistrict.filter(d => (d[currentDisease] || 0) >= 40);
	
	if (criticalAreas.length > 0) {
		recentAlertsContainer.innerHTML = '';
		criticalAreas.slice(0, 3).forEach(area => {
			const alert = document.createElement('div');
			alert.className = 'alert alert-danger mb-2';
			alert.innerHTML = `
				<strong>🚨 ${area.district}</strong><br/>
				<small>${currentDisease.toUpperCase()}: ${area[currentDisease]} cases</small>
			`;
			recentAlertsContainer.appendChild(alert);
		});
	} else {
		recentAlertsContainer.innerHTML = `
			<div class="alert alert-success">
				✅ No critical alerts at this time
			</div>
		`;
	}
}

// Update overview statistics
function updateOverviewStats() {
	const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
	const byDistrict = outbreaks.byDistrict || [];
	const diseaseFilter = document.getElementById('diseaseFilter');
	const currentDisease = diseaseFilter ? diseaseFilter.value : 'dengue';
	
	let activeTotal = 0;
	let highRisk = 0;
	let criticalAreas = [];
	
	byDistrict.forEach(d => {
		const count = d[currentDisease] || 0;
		activeTotal += count;
		if (count >= 20) highRisk += 1;
		if (count >= 40) criticalAreas.push(d.district);
	});
	
	// Update statistics
	document.getElementById('activeCases').textContent = activeTotal;
	document.getElementById('newCases').textContent = Math.max(3, Math.round(activeTotal * 0.08));
	document.getElementById('riskAreas').textContent = highRisk;
	
	// Calculate percentage changes (simulated)
	const activeChange = Math.round(Math.random() * 20 - 10); // -10% to +10%
	const newChange = Math.round(Math.random() * 30 - 15); // -15% to +15%
	
	document.getElementById('activeCasesChange').textContent = 
		`${activeChange > 0 ? '+' : ''}${activeChange}% from last week`;
	document.getElementById('newCasesChange').textContent = 
		`${newChange > 0 ? '+' : ''}${newChange}% from yesterday`;
	document.getElementById('riskAreasChange').textContent = 
		`${criticalAreas.length} districts on alert`;
	
	// Update district table in overview
	window.renderDistrictTable();
}

// Additional export functions
function exportToPDF() {
	try {
		const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
		const byDistrict = outbreaks.byDistrict || [];
		const diseaseFilter = document.getElementById('diseaseFilter');
		const currentDisease = diseaseFilter ? diseaseFilter.value : 'dengue';
		
		const totalCases = byDistrict.reduce((sum, d) => sum + (d[currentDisease] || 0), 0);
		const highRiskDistricts = byDistrict.filter(d => (d[currentDisease] || 0) >= 20);
		const criticalDistricts = byDistrict.filter(d => (d[currentDisease] || 0) >= 40);
		
		// Create PDF using jsPDF
		const { jsPDF } = window.jspdf;
		const doc = new jsPDF();
		
		// Set font
		doc.setFont('helvetica');
		
		// Title
		doc.setFontSize(20);
		doc.text('Kerala Health Dashboard Report', 20, 20);
		
		// Subtitle
		doc.setFontSize(14);
		doc.text(`Disease: ${currentDisease.toUpperCase()}`, 20, 35);
		doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);
		
		// Executive Summary
		doc.setFontSize(12);
		doc.text('Executive Summary', 20, 65);
		doc.setFontSize(10);
		doc.text(`• Total Active Cases: ${totalCases}`, 25, 80);
		doc.text(`• High Risk Districts (≥20 cases): ${highRiskDistricts.length}`, 25, 90);
		doc.text(`• Critical Districts (≥40 cases): ${criticalDistricts.length}`, 25, 100);
		doc.text(`• Total Districts Monitored: ${byDistrict.length}`, 25, 110);
		
		// District Breakdown Table
		doc.setFontSize(12);
		doc.text('District Breakdown', 20, 130);
		
		// Table headers
		doc.setFontSize(10);
		doc.text('District', 20, 145);
		doc.text('Cases', 80, 145);
		doc.text('Risk Level', 120, 145);
		
		// Table data
		let yPos = 155;
		byDistrict
			.sort((a, b) => (b[currentDisease] || 0) - (a[currentDisease] || 0))
			.forEach((d, index) => {
				if (yPos > 280) {
					doc.addPage();
					yPos = 20;
				}
				
				const cases = d[currentDisease] || 0;
				const risk = cases >= 40 ? 'CRITICAL' : cases >= 20 ? 'HIGH' : cases >= 10 ? 'MEDIUM' : 'LOW';
				
				doc.text(d.district, 20, yPos);
				doc.text(cases.toString(), 80, yPos);
				doc.text(risk, 120, yPos);
				yPos += 10;
			});
		
		// Critical Alerts
		if (criticalDistricts.length > 0) {
			if (yPos > 250) {
				doc.addPage();
				yPos = 20;
			}
			
			doc.setFontSize(12);
			doc.text('Critical Alerts', 20, yPos);
			yPos += 15;
			
			doc.setFontSize(10);
			criticalDistricts.forEach(d => {
				if (yPos > 280) {
					doc.addPage();
					yPos = 20;
				}
				doc.text(`• ${d.district}: ${d[currentDisease]} cases - IMMEDIATE ACTION REQUIRED`, 25, yPos);
				yPos += 10;
			});
		}
		
		// Recommendations
		if (yPos > 250) {
			doc.addPage();
			yPos = 20;
		}
		
		doc.setFontSize(12);
		doc.text('Recommendations', 20, yPos);
		yPos += 15;
		
		doc.setFontSize(10);
		if (criticalDistricts.length > 0) {
			doc.text('• Deploy emergency response teams to critical districts', 25, yPos);
			yPos += 10;
			doc.text('• Increase medical supplies and personnel', 25, yPos);
			yPos += 10;
			doc.text('• Implement containment measures', 25, yPos);
		} else if (highRiskDistricts.length > 0) {
			doc.text('• Monitor high risk districts closely', 25, yPos);
			yPos += 10;
			doc.text('• Prepare contingency plans', 25, yPos);
			yPos += 10;
			doc.text('• Increase surveillance', 25, yPos);
		} else {
			doc.text('• Continue routine monitoring', 25, yPos);
			yPos += 10;
			doc.text('• Maintain current prevention measures', 25, yPos);
		}
		
		// Save the PDF
		doc.save(`Kerala-${currentDisease}-Health-Report-${new Date().toISOString().split('T')[0]}.pdf`);
		
		showNotification('PDF report exported successfully!', 'success');
	} catch (error) {
		console.error('PDF export error:', error);
		showNotification('PDF export failed. Please try again.', 'danger');
	}
}

function exportToExcel() {
	const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
	const byDistrict = outbreaks.byDistrict || [];
	const diseaseFilter = document.getElementById('diseaseFilter');
	const currentDisease = diseaseFilter ? diseaseFilter.value : 'dengue';
	
	// Create CSV content (Excel compatible)
	const csvContent = [
		['Kerala Health Dashboard Report'],
		['Disease:', currentDisease.toUpperCase()],
		['Generated:', new Date().toLocaleString()],
		[''],
		['District', 'Dengue', 'Malaria', 'TB', 'COVID-19', 'Total Cases', 'Risk Level'],
		...byDistrict.map(d => {
			const total = (d.dengue || 0) + (d.malaria || 0) + (d.tb || 0) + (d.covid || 0);
			const current = d[currentDisease] || 0;
			const risk = current >= 40 ? 'CRITICAL' : current >= 20 ? 'HIGH' : current >= 10 ? 'MEDIUM' : 'LOW';
			return [d.district, d.dengue || 0, d.malaria || 0, d.tb || 0, d.covid || 0, total, risk];
		}),
		[''],
		['Summary'],
		['Total Active Cases', byDistrict.reduce((sum, d) => sum + (d[currentDisease] || 0), 0)],
		['High Risk Districts', byDistrict.filter(d => (d[currentDisease] || 0) >= 20).length],
		['Critical Districts', byDistrict.filter(d => (d[currentDisease] || 0) >= 40).length],
		['Total Districts', byDistrict.length]
	].map(row => row.join(',')).join('\n');
	
	// Create and download CSV
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `Kerala-${currentDisease}-Health-Report-${new Date().toISOString().split('T')[0]}.csv`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
	
	showNotification('Report exported as CSV (Excel compatible)!', 'success');
}

// Make functions globally accessible
window.showSection = showSection;
window.updateRecentAlerts = updateRecentAlerts;
window.updateOverviewStats = updateOverviewStats;
window.exportToPDF = exportToPDF;
window.exportToExcel = exportToExcel;

// Make other functions globally accessible for the navigation
window.renderAlerts = function(criticalAreas) {
	const container = document.getElementById('alertsContainer');
	if (!container) return;
	
	container.innerHTML = '';
	
	if (criticalAreas.length > 0) {
		criticalAreas.forEach(area => {
			const alert = document.createElement('div');
			alert.className = 'alert alert-danger d-flex justify-content-between align-items-center';
			alert.innerHTML = `
				<div>
					<strong>🚨 Critical Alert:</strong> ${area} district has high ${document.getElementById('diseaseFilter').value} cases
				</div>
				<div class="btn-group">
					<button class="btn btn-sm btn-outline-danger" onclick="viewDistrictDetails('${area}')">View Details</button>
					<button class="btn btn-sm btn-danger" onclick="sendAlertToOrganizations('${area}')">📢 Send Alert</button>
				</div>
			`;
			container.appendChild(alert);
		});
		
		// Add notification button for all critical areas
		const notifyAllBtn = document.createElement('div');
		notifyAllBtn.className = 'alert alert-warning d-flex justify-content-between align-items-center mt-2';
		notifyAllBtn.innerHTML = `
			<div>
				<strong>📢 Notify All Health Organizations</strong>
			</div>
			<button class="btn btn-warning btn-sm" onclick="sendBulkAlert()">Send Bulk Alert</button>
		`;
		container.appendChild(notifyAllBtn);
	} else {
		const noAlert = document.createElement('div');
		noAlert.className = 'alert alert-success';
		noAlert.innerHTML = '✅ No critical alerts at this time';
		container.appendChild(noAlert);
	}
};

window.renderDistrictTable = function() {
	const container = document.getElementById('districtTable');
	if (!container) return;
	
	const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
	const byDistrict = outbreaks.byDistrict || [];
	const diseaseFilter = document.getElementById('diseaseFilter');
	const currentDisease = diseaseFilter ? diseaseFilter.value : 'dengue';
	
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
};

window.renderTrends = function() {
	const ctx = document.getElementById('trendChart');
	if (!ctx) return;
	const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
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
};

// Make alert functions globally accessible
window.viewDistrictDetails = function(district) {
	const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
	const byDistrict = outbreaks.byDistrict || [];
	const diseaseFilter = document.getElementById('diseaseFilter');
	const currentDisease = diseaseFilter ? diseaseFilter.value : 'dengue';
	
	const districtData = byDistrict.find(d => d.district === district);
	if (!districtData) return;
	
	const cases = districtData[currentDisease] || 0;
	const riskLevel = cases >= 40 ? 'CRITICAL' : cases >= 20 ? 'HIGH' : 'LOW';
	
	alert(`
🏥 DISTRICT DETAILS

District: ${district}
Disease: ${currentDisease.toUpperCase()}
Active Cases: ${cases}
Risk Level: ${riskLevel}
Coordinates: ${districtData.coords[0]}, ${districtData.coords[1]}

All Diseases:
• Dengue: ${districtData.dengue || 0}
• Malaria: ${districtData.malaria || 0}
• TB: ${districtData.tb || 0}
• COVID-19: ${districtData.covid || 0}

Last Updated: ${new Date().toLocaleString()}
	`);
};

window.sendAlertToOrganizations = function(district) {
	const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
	const byDistrict = outbreaks.byDistrict || [];
	const diseaseFilter = document.getElementById('diseaseFilter');
	const currentDisease = diseaseFilter ? diseaseFilter.value : 'dengue';
	
	const cases = byDistrict.find(d => d.district === district)?.[currentDisease] || 0;
	
	// Show confirmation dialog
	const confirmed = confirm(`
🚨 SEND CRITICAL ALERT

District: ${district}
Disease: ${currentDisease.toUpperCase()}
Cases: ${cases}
Risk Level: ${cases >= 40 ? 'CRITICAL' : 'HIGH'}

This will notify:
• Kerala Health Department
• District Medical Office  
• Local Hospitals
• Emergency Response Team
• Public Health Centers

Send alert now?
	`);
	
	if (confirmed) {
		// Simulate API call
		setTimeout(() => {
			showNotification(`Alert sent to all health organizations for ${district}`, 'success');
			
			// Log the alert
			const alerts = JSON.parse(localStorage.getItem('health_alerts') || '[]');
			alerts.push({
				district: district,
				disease: currentDisease,
				cases: cases,
				riskLevel: cases >= 40 ? 'CRITICAL' : 'HIGH',
				timestamp: new Date().toISOString()
			});
			localStorage.setItem('health_alerts', JSON.stringify(alerts));
		}, 1000);
	}
};

window.sendBulkAlert = function() {
	const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
	const byDistrict = outbreaks.byDistrict || [];
	const diseaseFilter = document.getElementById('diseaseFilter');
	const currentDisease = diseaseFilter ? diseaseFilter.value : 'dengue';
	
	const criticalAreas = byDistrict.filter(d => (d[currentDisease] || 0) >= 40);
	
	if (criticalAreas.length === 0) {
		showNotification('No critical areas to alert', 'warning');
		return;
	}
	
	const confirmed = confirm(`
📢 SEND BULK ALERT

Critical Districts: ${criticalAreas.length}
Disease: ${currentDisease.toUpperCase()}

This will send alerts for:
${criticalAreas.map(d => `• ${d.district}: ${d[currentDisease]} cases`).join('\n')}

Send bulk alert to all health organizations?
	`);
	
	if (confirmed) {
		criticalAreas.forEach((area, index) => {
			setTimeout(() => {
				sendAlertToOrganizations(area.district);
			}, index * 500); // Stagger the alerts
		});
		
		setTimeout(() => {
			showNotification(`Bulk alert sent for ${criticalAreas.length} districts`, 'success');
		}, criticalAreas.length * 500 + 1000);
	}
};

window.showNotification = function(message, type = 'info') {
	// Create notification element
	const notification = document.createElement('div');
	notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
	notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
	notification.innerHTML = `
		${message}
		<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
	`;
	
	document.body.appendChild(notification);
	
	// Auto remove after 5 seconds
	setTimeout(() => {
		if (notification.parentNode) {
			notification.remove();
		}
	}, 5000);
};

// Map utility functions
window.toggleMapLegend = function() {
	const legend = document.getElementById('mapLegend');
	if (legend) {
		legend.style.display = legend.style.display === 'none' ? 'block' : 'none';
	}
};

window.fitMapToMarkers = function() {
	if (window.map) {
		const outbreaks = JSON.parse(localStorage.getItem('mw_outbreaks') || '{}');
		const byDistrict = outbreaks.byDistrict || [];
		
		if (byDistrict.length > 0) {
			const group = new L.featureGroup();
			byDistrict.forEach(d => {
				const marker = L.marker(d.coords);
				group.addLayer(marker);
			});
			window.map.fitBounds(group.getBounds().pad(0.1));
		}
	}
};

// Theme toggle functionality
window.toggleTheme = function() {
	const currentTheme = document.documentElement.getAttribute('data-theme');
	const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
	
	// Set new theme
	document.documentElement.setAttribute('data-theme', newTheme);
	
	// Update button text and icon
	const themeIcon = document.getElementById('themeIcon');
	const themeToggle = document.getElementById('themeToggle');
	
	if (newTheme === 'dark') {
		themeIcon.textContent = '☀️';
		themeToggle.innerHTML = '<span id="themeIcon">☀️</span> Light';
	} else {
		themeIcon.textContent = '🌙';
		themeToggle.innerHTML = '<span id="themeIcon">🌙</span> Dark';
	}
	
	// Save theme preference
	localStorage.setItem('theme', newTheme);
	
	// Show notification
	showNotification(`Switched to ${newTheme} theme`, 'info');
};

// Initialize theme on page load
function initializeTheme() {
	const savedTheme = localStorage.getItem('theme') || 'light';
	document.documentElement.setAttribute('data-theme', savedTheme);
	
	// Update button to show current theme
	const themeIcon = document.getElementById('themeIcon');
	const themeToggle = document.getElementById('themeToggle');
	
	if (savedTheme === 'dark') {
		themeIcon.textContent = '☀️';
		themeToggle.innerHTML = '<span id="themeIcon">☀️</span> Light';
	} else {
		themeIcon.textContent = '🌙';
		themeToggle.innerHTML = '<span id="themeIcon">🌙</span> Dark';
	}
}

// Initialize overview data when page loads
document.addEventListener('DOMContentLoaded', function() {
	// Initialize theme first
	initializeTheme();
	
	// Wait a bit for the dashboard to initialize
	setTimeout(() => {
		window.updateOverviewStats();
		window.updateRecentAlerts();
	}, 1000);
});

