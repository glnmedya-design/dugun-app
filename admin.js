import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {

getFirestore,
collection,
getDocs,
deleteDoc,
doc,
updateDoc

}

from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";



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



const takvim =
document.getElementById("takvim");


const toplamRez =
document.getElementById("toplamRez");


const toplamKazanc =
document.getElementById("toplamKazanc");


const bekleyenSayisi =
document.getElementById("bekleyenSayisi");



async function rezervasyonlariGetir(){

takvim.innerHTML = "";


const querySnapshot =
await getDocs(
collection(db,"rezervasyonlar")
);


let rezervasyonAdet = 0;

let kazanc = 0;

let bekleyen = 0;



querySnapshot.forEach((item)=>{

const veri = item.data();

rezervasyonAdet++;


kazanc += Number(veri.toplam || 0);


const durum =
veri.durum || "Bekliyor";


if(durum === "Bekliyor"){

bekleyen++;

}



let durumClass = "bekliyor";


if(durum === "Onaylandi"){

durumClass = "onaylandi";

}


if(durum === "Iptal"){

durumClass = "iptal";

}



takvim.innerHTML += `

<div class="rezervasyon">

<h3>
${veri.adSoyad}
</h3>

<div class="bilgi">
📞 ${veri.telefon}
</div>

<div class="bilgi">
📅 ${veri.tarih}
</div>

<div class="bilgi">
⏰ ${veri.baslangicSaat}
-
${veri.bitisSaat}
</div>

<div class="bilgi">
🎊 ${veri.organizasyon}
</div>

<div class="bilgi">
🛒 ${veri.paketler.join(", ")}
</div>

<div class="bilgi">
💰 ${veri.toplam} TL
</div>

<div class="durum ${durumClass}">
${durum}
</div>

<div class="butons">

<button
class="onayBtn"
onclick="onayla('${item.id}')">

Onayla

</button>


<button
class="iptalBtn"
onclick="iptalEt('${item.id}')">

Vazgeç

</button>


<button
class="silBtn"
onclick="sil('${item.id}')">

Sil

</button>

</div>

</div>

`;

});



toplamRez.innerText =
rezervasyonAdet;


toplamKazanc.innerText =

kazanc.toLocaleString("tr-TR")
+ " TL";


bekleyenSayisi.innerText =
bekleyen;

}



window.onayla =
async function(id){

await updateDoc(

doc(db,"rezervasyonlar",id),

{
durum:"Onaylandi"
}

);

await rezervasyonlariGetir();

}



window.iptalEt =
async function(id){

await updateDoc(

doc(db,"rezervasyonlar",id),

{
durum:"Iptal"
}

);

await rezervasyonlariGetir();

}



window.sil =
async function(id){

const onay =
confirm(
"Rezervasyon silinsin mi?"
);

if(!onay) return;


await deleteDoc(
doc(db,"rezervasyonlar",id)
);

await rezervasyonlariGetir();

}



rezervasyonlariGetir();