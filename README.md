# IlliniFoodies-Backend


id_token = location.hash.split('&')[0].split('=')[1];
document.cookie = "idtoken=" + id_token;

function removeHash () { 
    history.pushState("", document.title, window.location.pathname
                                                       + window.location.search);
}

removeHash();

http://auth.illinifoodies.xyz/login?response_type=token&client_id=2h8u013ovbmseaaurir8981hcs&redirect_uri=https://illinifoodies.xyz # IlliniFoodies-Backend
