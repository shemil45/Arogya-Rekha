// QR code helper using qrcode library
window.QR = {
	/** Render QR into containerId with given text */
	render: function (containerId, text, size = 220) {
		const container = document.getElementById(containerId);
		if (!container) return;
		container.innerHTML = '';
		
		// Use the modern qrcode library
		if (typeof QRCode !== 'undefined') {
			// Create a canvas element
			const canvas = document.createElement('canvas');
			container.appendChild(canvas);
			
			// Generate QR code
			QRCode.toCanvas(canvas, text, {
				width: size,
				margin: 2,
				color: {
					dark: '#000000',
					light: '#ffffff'
				}
			}, function (error) {
				if (error) {
					console.error('QR Code generation error:', error);
					container.innerHTML = '<div class="text-muted small">QR Code Error</div>';
				}
			});
		} else {
			// Fallback if QRCode library not loaded
			container.innerHTML = '<div class="text-muted small">QR Code Library Not Loaded</div>';
		}
	}
};

