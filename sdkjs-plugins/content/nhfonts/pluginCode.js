(function() {
	// OnlyOffice plugin initialization
	if (window.Asc && window.Asc.plugin) {
		window.Asc.plugin.init = function() {
			setStatus("NHFonts SVG plugin initialized");
		};

		window.Asc.plugin.button = function(id) {
			this.executeCommand("close", "");
		};
	} else {
		console.error("Asc.plugin not available yet");
	}

	// Helper to set status
	function setStatus(msg) {
		var el = document.getElementById('status');
		if (el) el.textContent = msg;
		console.log('[NHFontsSVG]', msg);
	}

	// SVG generator (simple, no external deps)
	function generateSVG(text, fontFamily, fontSize, color) {
		// Basic SVG text element, single line, no font loading
		var lines = text.split('\n');
		var lineHeight = fontSize * 1.2;
		var width = fontSize * Math.max(...lines.map(l => l.length)) * 0.6 + 20;
		var height = lineHeight * lines.length + 20;
		var svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>`;
		svg += `<g font-family='${fontFamily}' font-size='${fontSize}' fill='${color}'>`;
		lines.forEach(function(line, i) {
			svg += `<text x='10' y='${20 + i * lineHeight}'>${escapeXML(line)}</text>`;
		});
		svg += `</g></svg>`;
		return svg;
	}

	function escapeXML(str) {
		return str.replace(/[&<>]/g, function(c) {
			return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];
		});
	}

	// Insert SVG as image into OnlyOffice
	window.insertSVG = function() {
		var text = document.getElementById('text').value;
		var fontKey = document.getElementById('font').value;
		var fontSize = parseInt(document.getElementById('fontSize').value, 10) || 40;
		var textColor = document.getElementById('textColor').value;

		// Map fontKey to font-family name
		var fontMap = { NH1: 'NHHandwriting', NH2: 'NHHandwriting RL', NH3: 'NHHandwriting RL TW Light' };
		var fontFamily = fontMap[fontKey] || 'sans-serif';

		setStatus('Generating SVG...');
		var svg = generateSVG(text, fontFamily, fontSize, textColor);
		var svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));

		// Estimate size in EMUs (1px = 9525 EMUs)
		var width = fontSize * Math.max(...text.split('\n').map(l => l.length)) * 0.6 + 20;
		var height = fontSize * 1.2 * text.split('\n').length + 20;
		var emuW = Math.round(width * 9525);
		var emuH = Math.round(height * 9525);

		// Insert image into document
		setStatus('Inserting SVG...');
		window.Asc.plugin.callCommand(function() {
			var oImage = Api.CreateImage(svgDataUrl, emuW, emuH);
			var editor = Asc.plugin.info.editorType;
			if (editor === 'slide') {
				var oPresentation = Api.GetPresentation();
				var nSlide = oPresentation.GetCurSlideIndex();
				var oSlide = oPresentation.GetSlideByIndex(nSlide);
				oImage.SetPosition(36000 * 10, 36000 * 10);
				oImage.SetSize(emuW, emuH);
				oSlide.AddObject(oImage);
			} else {
				var oDocument  = Api.GetDocument();
				var oParagraph = Api.CreateParagraph();
				oParagraph.AddDrawing(oImage);
				oDocument.InsertContent([oParagraph]);
			}
		}, false, true, function(err) {
			if (err) {
				setStatus('Error: ' + JSON.stringify(err));
			} else {
				setStatus('Done.');
			}
		});
	};

})();