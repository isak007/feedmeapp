export default function authHeader() {
    var userStorage = localStorage.getItem("user");
    if (userStorage != null){
        let user = JSON.parse(userStorage);
        if (user && user.jwt) {
            return `Authorization: Bearer ${user.jwt}`;
        } else {
            return '';
        }
    } return {};
}