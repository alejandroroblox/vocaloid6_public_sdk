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
echo ===============================
echo   Instalador de Voicebank
echo ===============================
echo Preparando la instalación...
timeout /t 2 > nul

echo Paso 1: Creando carpeta Voicebank...
mkdir Voicebank
timeout /t 1 > nul

echo Paso 2: Copiando archivos necesarios a la carpeta Voicebank...
copy config.json Voicebank\\
copy oto.ini Voicebank\\
copy voicebank_config.reg Voicebank\\
copy voice.vvd Voicebank\\
copy settings.v6 Voicebank\\
copy parameters.dat Voicebank\\
timeout /t 1 > nul

echo Paso 3: Aplicando configuraciones en el registro de Windows (¡Ten cuidado!)...
regedit.exe /s Voicebank\\voicebank_config.reg
timeout /t 1 > nul

echo Paso 4: Verificando los archivos copiados...
dir Voicebank
timeout /t 2 > nul

echo ===============================
echo   Instalación completada
echo ===============================
echo El Voicebank se ha instalado correctamente. ¡Gracias por usar el instalador!
pause
exit`,
        },
        {
            name: "voice.vvd",
            content: `# Archivo VVD
# Contiene información sobre el rango de frecuencia y duración de las muestras.
VoiceBank: ${voicebankName}
Gender: ${voicebankGender}
Language: ${voicebankLanguage}
Frequency Range: 100Hz-4000Hz
Duration: 3-5 segundos por muestra`,
        },
        {
            name: "settings.v6",
            content: `# Archivo V6
# Configuración avanzada del Voicebank.
[Settings]
VoiceBankName=${voicebankName}
VoiceBankGender=${voicebankGender}
Language=${voicebankLanguage}
ToneAdjustment=True
NoiseReduction=True`,
        },
        {
            name: "parameters.dat",
            content: `# Archivo DAT
# Parámetros personalizados del Voicebank.
VoiceBank=${voicebankName}
Gender=${voicebankGender}
Language=${voicebankLanguage}
Pitch=150
Speed=100
Samples=${wavFiles.length}
Sample1=${wavFiles.length > 0 ? wavFiles[0].name : ""}
Sample2=${wavFiles.length > 1 ? wavFiles[1].name : ""}`,
        }
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
