function girisYap(){

const kullaniciAdi =
document.getElementById("kullaniciAdi").value;

const sifre =
document.getElementById("sifre").value;



if(

kullaniciAdi === "mustafagulten"
&&
sifre === "17111991"

){

localStorage.setItem(
"adminGiris",
"true"
);

window.location.href =
"admin.html";

}

else{

document.getElementById("hata")
.innerText =
"Kullanıcı adı veya şifre yanlış!";

}

}
