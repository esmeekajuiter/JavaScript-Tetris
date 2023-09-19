//Maakt de highscore weer 0 bij het herladen van de pagina.
document.cookie = "highscore=0; expires=Fri, 31 Dec 9999 23:59:59 GMT;";
console.log(document.cookie);

/**
 * Geeft de value van de cookie die je opzoekt gebaseerd op naam.
 */
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
    c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Verandert de cookie highscore als de nieuwe score groter is dan highscore.
 */
function changeCookies() {
  let highscore = getCookie("highscore");
  if(account.score > highscore) {
    document.cookie = "highscore=" + account.score + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;";
  }
}

/**
 * Laat de cookie zien nadat hij door changeCookie() is geweest.
 */
function showCookies() {
  changeCookies();
  let highscore = getCookie("highscore");
  const output = document.getElementById('highscore');
  output.textContent = highscore;
  console.log(document.cookie);
}