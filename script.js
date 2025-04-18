document.getElementById("generateZip").addEventListener("click", async function () {
    const voicebankName = document.getElementById("voicebankName").value;
    const voicebankGender = document.getElementById("voicebankGender").value;
    const voicebankLanguage = document.getElementById("voicebankLanguage").value;

    // Capturar los archivos WAV seleccionados
    const wavFiles = document.getElementById("wavFiles").files;

    if (!voicebankName || wavFiles.length === 0) {
        alert("Por favor, introduce el nombre del Voicebank y selecciona al menos un archivo WAV.");
        return;
    }

    // Crear instancia de JSZip
    const zip = new JSZip();

    // Agregar archivos WAV al ZIP
    for (let i = 0; i < wavFiles.length; i++) {
        const file = wavFiles[i];
        zip.file(file.name, file);
    }

    // Generar contenido de archivos adicionales
    const files = [
        {
            name: "config.json",
            content: JSON.stringify({
                voicebank_name: voicebankName,
                voicebank_gender: voicebankGender,
                voicebank_language: voicebankLanguage,
                pitch: 150,
                speed: 100,
                sample_files: Array.from(wavFiles).map(file => file.name),
            }, null, 4),
        },
        {
            name: "oto.ini",
            content: `[Voicebank OTO]\n${Array.from(wavFiles).map(file => `${file.name}=0,0,10,100,5`).join("\n")}`,
        },
        {
            name: "voicebank_config.reg",
            content: `Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\\Software\\Vocaloid6\\Voicebank]
"VoicebankName"="${voicebankName}"
"VoicebankGender"="${voicebankGender}"
"VoiceType"="Artificial Intelligence"
"AIEnabled"="True"
"Language"="${voicebankLanguage}"
"Samples"="${Array.from(wavFiles).map(file => file.name).join(";")}"
"ModelType"="NeuralAI"
"Version"="6.0"
"PitchAdjustment"="150"
"SpeedAdjustment"="100"
"EmotionParameter"="Neutral"`,
        },
        {
            name: "setup.bat",
            content: `@echo off
echo Bienvenido al instalador de Voicebank para Vocaloid 6.
echo Instalando archivos necesarios...
timeout /t 2 > nul

echo Paso 1: Creando carpeta Voicebank...
mkdir Voicebank
timeout /t 1 > nul

echo Paso 2: Copiando archivos Voicebank...
copy config.json Voicebank\\
copy oto.ini Voicebank\\
copy voicebank_config.reg Voicebank\\
timeout /t 1 > nul

echo Paso 3: Aplicando configuración al registro (¡Ten cuidado!)...
regedit.exe /s Voicebank\\voicebank_config.reg
timeout /t 1 > nul

echo Instalación completada. ¡Gracias por utilizar el instalador!
pause
exit`,
        },
    ];

    // Agregar archivos adicionales al ZIP
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
