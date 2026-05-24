const form =
document.getElementById("rezervasyonForm");

const toplamFiyat =
document.getElementById("toplamFiyat");

const checkboxlar =
document.querySelectorAll('input[type="checkbox"]');

checkboxlar.forEach(box => {

box.addEventListener("change", hesapla);

});

function hesapla(){

let toplam = 0;

checkboxlar.forEach(box => {

if(box.checked){

const fiyat =
parseInt(box.value.match(/\d+/));

if(!isNaN(fiyat)){

toplam += fiyat;

}

}

});

toplamFiyat.innerText = toplam;

}

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const adSoyad =
document.getElementById("adSoyad").value;

const telefon =
document.getElementById("telefon").value;

const tarih =
document.getElementById("tarih").value;

const organizasyon =
document.getElementById("organizasyon").value;

const mesaj =
document.getElementById("mesaj").value;

const kvkkOnay =
document.getElementById("kvkkOnay").checked;

const gorselOnay =
document.getElementById("gorselOnay").checked;

if(!kvkkOnay || !gorselOnay){

alert("Sözleşmeleri onaylamalısınız.");

return;

}

const secilenler = [];

checkboxlar.forEach(box=>{

if(box.checked && box.value){

secilenler.push(box.value);

}

});

const botToken = "BURAYA_BOT_TOKEN";
const chatId = "BURAYA_CHAT_ID";

const text = `
Yeni Rezervasyon

Ad Soyad: ${adSoyad}
Telefon: ${telefon}
Tarih: ${tarih}
Organizasyon: ${organizasyon}

Seçilen Hizmetler:
${secilenler.join("\n")}

Mesaj:
${mesaj}

Toplam:
${toplamFiyat.innerText} TL
`;

await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
chat_id:chatId,
text:text
})

});

alert("Rezervasyon başarıyla gönderildi.");

form.reset();

toplamFiyat.innerText = "0";

});
