// Capturar el botón para generar ZIP
document.getElementById("generateZip").addEventListener("click", async function () {
    const voicebankName = document.getElementById("voicebankName").value;
    const voicebankGender = document.getElementById("voicebankGender").value;
    const wavFiles = document.getElementById("wavFiles").files;

    if (!voicebankName) {
        alert("Por favor, introduce el nombre del Voicebank.");
        return;
    }

    if (wavFiles.length === 0) {
        alert("Por favor, selecciona al menos un archivo WAV.");
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
                sample_files: Array.from(wavFiles).map(file => file.name),
            }, null, 4),
        },
        {
            name: "oto.ini",
            content: `[Voicebank OTO]\n${Array.from(wavFiles)
                .map(file => `${file.name}=0,0,10,100,5`)
                .join("\n")}`,
        },
        {
            name: "voicebank_config.reg",
            content: `Windows Registry Editor Version 5.00\n\n[HKEY_CURRENT_USER\\Software\\VoicebankCreator]\n"VoicebankName"="${voicebankName}"\n"VoicebankGender"="${voicebankGender}"\n"VoiceFiles"="${Array.from(wavFiles)
                .map(file => file.name)
                .join(";")}"`,
        }
    ];

    // Agregar archivos JSON, INI y REG al ZIP
    files.forEach(file => {
        zip.file(file.name, file.content);
    });

    // Agregar archivos WAV al ZIP
    for (const file of wavFiles) {
        const fileContent = await file.arrayBuffer(); // Leer el contenido del archivo
        zip.file(file.name, fileContent);
    }

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
