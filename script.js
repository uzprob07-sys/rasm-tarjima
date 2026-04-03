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

    status.innerText = "Matn o'qilyapti (OCR)...";
    const image = imageInput.files[0];

    try {
        // 1. Rasmdan matnni ajratib olish
        const result = await Tesseract.recognize(image, 'eng+rus'); // Ingliz va rus tillarini taniydi
        const text = result.data.text;
        extractedTextDiv.innerText = text;

        if (!text.trim()) {
            status.innerText = "Matn topilmadi.";
            return;
        }

        // 2. Tarjima qilish (Bepul Google Translate API orqali)
        status.innerText = "Tarjima qilinmoqda...";
        const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        let translatedText = "";
        data[0].forEach(item => {
            if (item[0]) translatedText += item[0];
        });

        translatedTextDiv.innerText = translatedText;
        status.innerText = "Bajarildi!";

    } catch (error) {
        console.error(error);
        status.innerText = "Xatolik yuz berdi.";
    }
}