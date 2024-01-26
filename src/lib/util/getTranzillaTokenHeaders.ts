import CryptoJS from "crypto-js";

function makeid(length: number) {
  var result = ""
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

var time = Math.round((new Date()).getTime() / 1000);
var nonce =
  "949ea362891adfe9085057c4560ef1142cbe9893817343b9bad71407e977a7d4ab67ad075d5d71b3"
var key =
  "XZyY6L8EwC4MiRZOAQdnEQ3Acq25ayXNOiITJzfHdPP1sRwKvjYp1VpeTWQwZheKIzTPLw9q0ln"
var privateKey = "tE07ITwV8o"
var hash = CryptoJS.HmacSHA256(key, privateKey + time + nonce).toString(
  CryptoJS.enc.Hex
)

var headers = {
  "X-tranzila-api-app-key": key,
  "X-tranzila-api-request-time": time.toString(),
  "X-tranzila-api-nonce": nonce,
  "X-tranzila-api-access-token": hash,
  "Content-Type": "application/json",
  "Allow-Control-Allow-Origin": "*",
 
  
}

export default headers
