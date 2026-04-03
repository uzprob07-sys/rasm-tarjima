async function processImage() {
    const imageInput = document.getElementById('imageInput');
    const status = document.getElementById('status');
    const extractedTextDiv = document.getElementById('extractedText');
    const translatedTextDiv = document.getElementById('translatedText');
    const targetLang = document.getElementById('targetLang').value;

    if (imageInput.files.length === 0) {
        alert("Iltimos, rasm tanlang!");
        return;
    }

    status.innerText = "🔍 Matn o'qilmoqda (OCR)...";
    status.style.color = "blue";
    
    const image = imageInput.files[0];

    try {
        // 1. Rasmdan matnni aniqlash
        // 'eng+rus' - ingliz va rus tillarini birga taniydi
        const result = await Tesseract.recognize(image, 'eng+rus', {
            logger: m => console.log(m) // Konsolda jarayonni ko'rish uchun
        });

        // Matnni tozalaymiz (ortiqcha bo'shliqlar va yangi qatorlarni olib tashlaymiz)
        let cleanText = result.data.text
            .replace(/\n/g, ' ') 
            .replace(/\s+/g, ' ')
            .trim();

        extractedTextDiv.innerText = cleanText || "Matn topilmadi.";

        if (!cleanText) {
            status.innerText = "❌ Rasmdan matn topilmadi.";
            status.style.color = "red";
            return;
        }

        // 2. Tarjima qilish
        status.innerText = "🌐 Tarjima qilinmoqda...";
        
        // Bepul Google Translate API (yaxshilangan URL)
        const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(cleanText)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Tarjima qismlarini birlashtiramiz
        let finalTranslation = "";
        if (data[0]) {
            data[0].forEach(item => {
                if (item[0]) finalTranslation += item[0];
            });
        }

        translatedTextDiv.innerText = finalTranslation;
        status.innerText = "✅ Tayyor!";
        status.style.color = "green";

    } catch (error) {
        console.error("Xatolik:", error);
        status.innerText = "⚠️ Xatolik yuz berdi. Internetni tekshiring.";
        status.style.color = "red";
    }
}