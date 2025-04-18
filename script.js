// Capturar el botón para generar ZIP
document.getElementById("generateZip").addEventListener("click", async function () {
    const voicebankName = document.getElementById("voicebankName").value;
    const voicebankGender = document.getElementById("voicebankGender").value;

    if (!voicebankName) {
        alert("Por favor, introduce el nombre del Voicebank.");
        return;
    }

    // Crear instancia de JSZip
    const zip = new JSZip();

    // Generar contenido de archivos
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
            content: `Windows Registry Editor Version 5.00\n\n[HKEY_CURRENT_USER\\Software\\VoicebankCreator]\n"VoicebankName"="${voicebankName}"\n"VoicebankGender"="${voicebankGender}"\n"VoiceFiles"="sample1.wav;sample2.wav"`,
        }
    ];

    // Agregar archivos al ZIP
    files.forEach(file => {
        zip.file(file.name, file.content);
    });

    // Generar el ZIP y crear enlace de descarga
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${voicebankName}_voicebank.zip`;
    link.textContent = `Descargar ${voicebankName}_voicebank.zip`;
    link.style.display = "block";
    document.body.appendChild(link);

    alert("¡Archivo ZIP generado con éxito!");
});

