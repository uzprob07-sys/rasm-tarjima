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

    status.innerText = "🔍 Matn o'qilmoqda...";
    status.style.color = "blue";
    
    const image = imageInput.files[0];

    try {
        // 1. OCR orqali matnni o'qish
        const result = await Tesseract.recognize(image, 'eng+rus');
        let text = result.data.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

        if (!text) {
            status.innerText = "❌ Rasmdan matn topilmadi.";
            status.style.color = "red";
            extractedTextDiv.innerText = "Bo'sh.";
            return;
        }

        extractedTextDiv.innerText = text;
        status.innerText = "🌐 Tarjima qilinmoqda...";

        // 2. Tarjima qilish (Muqobil va barqaror URL)
        const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error("Tarjima xizmati javob bermadi");

        const data = await response.json();
        
        let translatedText = "";
        if (data && data[0]) {
            data[0].forEach(part => {
                if (part[0]) translatedText += part[0];
            });
        }

        translatedTextDiv.innerText = translatedText;
        status.innerText = "✅ Bajarildi!";
        status.style.color = "green";

    } catch (error) {
        console.error("Xatolik tafsiloti:", error);
        status.innerText = "⚠️ Xatolik: Internet yoki xizmatda muammo.";
        status.style.color = "red";
    }
}