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
        },
        {
            name: "setup.bat",
            content: `@echo off
echo Bienvenido al instalador de Voicebank.
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
        {
            name: "voice.vvd",
            content: `# Archivo VVD
# Contiene información sobre el rango de frecuencia y duración de las muestras.
VoiceBank: ${voicebankName}
Gender: ${voicebankGender}
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
Language=Español
ToneAdjustment=True
NoiseReduction=True`,
        },
        {
            name: "parameters.dat",
            content: `# Archivo DAT
# Parámetros personalizados del Voicebank.
VoiceBank=${voicebankName}
Gender=${voicebankGender}
Pitch=150
Speed=100
Samples=2
Sample1=sample1.wav
Sample2=sample2.wav`,
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
