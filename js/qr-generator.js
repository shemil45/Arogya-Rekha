// QR code helper using qrcodejs
window.QR = {
	/** Render QR into containerId with given text */
	render: function (containerId, text, size = 220) {
		const container = document.getElementById(containerId);
		if (!container) return;
		container.innerHTML = '';
		/* global QRCode */
		new QRCode(container, {
			text,
			width: size,
			height: size,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: QRCode.CorrectLevel.M
		});
	}
};

