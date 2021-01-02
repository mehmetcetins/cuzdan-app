const errorMessage = {
    "auth/email-already-in-use": "Bu email ile daha önce kayıt olunmuş.",
    "auth/invalid-email": "Geçersiz email adresi",
    "auth/weak-password": "Şifreniz çok zayıf",
    "auth/user-not-found" : "Kullanıcı Bulunamadı.",
    "auth/wrong-password" : "Şifreniz Hatalı",
    "98" : "Şifreler birbiriyle aynı değil",
    "99" : "Email adresi girmelisiniz",
}


export  const getErrorMessage = (errorCode) => {
    return errorMessage[errorCode];
}