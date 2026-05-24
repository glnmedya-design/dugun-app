import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {

getFirestore,
collection,
addDoc,
getDocs

}

from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";



const BOT_TOKEN =
"8727284798:AAF4Z9gNN1H4Pdhn5p0os59qb7z2lM2juqU";


const CHAT_ID =
"1078328207";



const firebaseConfig = {

apiKey: "AIzaSyBhvOd6JsJssRvJqI7GS9pdqzXkEFG38ls",

authDomain:
"dugun-rezervasyon-abbaf.firebaseapp.com",

projectId:
"dugun-rezervasyon-abbaf",

storageBucket:
"dugun-rezervasyon-abbaf.firebasestorage.app",

messagingSenderId:
"1051112306377",

appId:
"1:1051112306377:web:2a57e09bd8e43af79a7f18"

};



const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);



const checkboxlar =
document.querySelectorAll(
'input[type="checkbox"]'
);


const toplamFiyat =
document.getElementById("toplamFiyat");



function toplamHesapla(){

let toplam = 0;


checkboxlar.forEach((item)=>{

if(item.checked){

const fiyat =
parseInt(item.value.split("-")[1]);

toplam += fiyat;

}

});


toplamFiyat.textContent = toplam;

}



checkboxlar.forEach((item)=>{

item.addEventListener(
"change",
toplamHesapla
);

});



document
.getElementById("rezervasyonForm")
.addEventListener("submit",
async function(e){

e.preventDefault();


const adSoyad =
document.getElementById("adSoyad").value;


const telefon =
document.getElementById("telefon").value;


const tarih =
document.getElementById("tarih").value;


const baslangicSaat =
document.getElementById("baslangicSaat").value;


const bitisSaat =
document.getElementById("bitisSaat").value;


const organizasyon =
document.getElementById("organizasyon").value;
const kvkkOnay =
document.getElementById("kvkkOnay").checked;

const gorselOnay =
document.getElementById("gorselOnay").checked;

if(!kvkkOnay || !gorselOnay){

alert("Rezervasyon göndermek için KVKK ve görsel kullanım izinlerini onaylamalısınız.");

return;

}


if(baslangicSaat >= bitisSaat){

alert(
"Bitiş saati başlangıç saatinden büyük olmalı!"
);

return;

}



const querySnapshot =
await getDocs(
collection(db,"rezervasyonlar")
);


let dolu = false;


querySnapshot.forEach((doc)=>{

const veri = doc.data();


if(veri.tarih === tarih){

if(

baslangicSaat < veri.bitisSaat &&
bitisSaat > veri.baslangicSaat

){

dolu = true;

}

}

});



if(dolu){

alert(
"Bu saat aralığında rezervasyon mevcut!"
);

return;

}



let secilenler = [];


checkboxlar.forEach((item)=>{

if(item.checked){

secilenler.push(item.value);

}

});



await addDoc(
collection(db,"rezervasyonlar"),
{

adSoyad,
telefon,
kvkkOnay,
gorselOnay,
onayTarihi: new Date().toLocaleString("tr-TR"),
tarih,
baslangicSaat,
bitisSaat,
organizasyon,
paketler: secilenler,
toplam: toplamFiyat.textContent,
durum:"Bekliyor"

}

);



const mesaj = `

🎉 Yeni Rezervasyon

👤 ${adSoyad}

📞 ${telefon}

📅 ${tarih}

⏰ ${baslangicSaat} - ${bitisSaat}

🎊 ${organizasyon}

🛒 ${secilenler.join(", ")}

💰 ${toplamFiyat.textContent} TL

`;



await fetch(

`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

chat_id:CHAT_ID,
text:mesaj

})

}

);



alert(
"Rezervasyonunuz alınmıştır 👍"
);


document
.getElementById("rezervasyonForm")
.reset();


toplamFiyat.textContent = "0";

});
