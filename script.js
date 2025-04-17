// Capturar el botón de generación
document.getElementById("generateFiles").addEventListener("click", function () {
    const voicebankName = document.getElementById("voicebankName").value;
    const voicebankGender = document.getElementById("voicebankGender").value;

    if (!voicebankName) {
        alert("Por favor, introduce el nombre del Voicebank.");
        return;
    }

    // Crear los archivos para descarga
    const files = [
        {
            name: "config.json",
            content: JSON.stringify({
                voicebank_name: voicebankName,
                voicebank_gender: voicebankGender,
                pitch: 150,
                speed: 100,
                sample_files: ["sample1.wav", "sample2.wav"],
            }, null, 4),
        },
        {
            name: "oto.ini",
            content: `[Voicebank OTO]\nsample1.wav=0,0,10,100,5\nsample2.wav=0,0,15,120,5`,
        },
        {
            name: "voicebank_config.reg",
            content: `Windows Registry Editor Version 5.00\n\n[HKEY_CURRENT_USER\\Software\\VoicebankCreator]\n"VoicebankName"="${voicebankName}"\n"VoicebankGender"="${voicebankGender}"\n"VoicebankPath"="C:\\\\Voicebanks\\\\${voicebankName}"\n"VoiceFiles"="sample1.wav;sample2.wav"`,
        }
    ];

    // Generar enlaces de descarga
    const downloadLinksDiv = document.getElementById("downloadLinks");
    downloadLinksDiv.innerHTML = ""; // Limpiar enlaces previos

    files.forEach(file => {
        const blob = new Blob([file.content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        link.textContent = `Descargar ${file.name}`;
        link.style.display = "block";
        link.style.marginTop = "10px";

        downloadLinksDiv.appendChild(link);
    });

    alert("¡Archivos generados! Ahora puedes descargarlos.");
});
