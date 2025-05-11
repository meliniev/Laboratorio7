export default function authHeader() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario && usuario.accessToken) {
    console.log("Token encontrado para autorización");
    return { 
      'x-access-token': usuario.accessToken,
      'Authorization': 'Bearer ' + usuario.accessToken
    };
  } else {
    console.log("No se encontró token de autorización");
    return {};
  }
}
