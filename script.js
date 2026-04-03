async function processImage() {
    const imageInput = document.getElementById('imageInput');
    const status = document.getElementById('status');
    const extractedTextDiv = document.getElementById('extractedText');
    const translatedTextDiv = document.getElementById('translatedText');
    const targetLang = document.getElementById('targetLang').value;
    const btn = document.getElementById('btnTranslate');

    if (imageInput.files.length === 0) {
        alert("Iltimos, avval rasm tanlang!");
        return;
    }

    // Jarayon boshlandi
    btn.disabled = true;
    status.innerText = "⏳ Matn aniqlanmoqda (bu 10-20 soniya olishi mumkin)...";
    status.style.color = "blue";
    extractedTextDiv.innerText = "Yuklanmoqda...";
    translatedTextDiv.innerText = "...";

    const image = imageInput.files[0];

    try {
        // 1. Tesseract orqali matnni o'qish
        const worker = await Tesseract.createWorker('eng+rus');
        const ret = await worker.recognize(image);
        let rawText = ret.data.text.trim();
        await worker.terminate();

        if (!rawText) {
            throw new Error("Rasmdan matn topilmadi.");
        }

        // Matnni tozalash
        let cleanText = rawText.replace(/\s+/g, ' ').trim();
        extractedTextDiv.innerText = cleanText;

        // 2. Tarjima qilish
        status.innerText = "🌐 Tarjima qilinmoqda...";
        
        // Google Translate uchun muqobil (CORS xatosini chetlab o'tish uchun)
        const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(cleanText)}`;
        
        const response = await fetch(translateUrl);
        const data = await response.json();
        
        let result = "";
        if (data && data[0]) {
            data[0].forEach(item => {
                if (item[0]) result += item[0];
            });
        }

        translatedTextDiv.innerText = result;
        status.innerText = "✅ Muvaffaqiyatli yakunlandi!";
        status.style.color = "green";

    } catch (error) {
        console.error(error);
        status.innerText = "❌ Xatolik: " + error.message;
        status.style.color = "red";
        extractedTextDiv.innerText = "Xato yuz berdi.";
    } finally {
        btn.disabled = false;
    }
}