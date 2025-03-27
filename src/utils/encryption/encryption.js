import CryptoJS from "crypto-js";

export const encrypt = ({plainText,signature = process.env.SECRET_KEY}) => {

    return CryptoJS.AES.encrypt(plainText,signature).toString();

}

export const decrypt = ({encrypted,signature}) => {

    return CryptoJS.AES.decrypt(encrypted,signature).toString(CryptoJS.enc.Utf8);

}