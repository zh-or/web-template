import t from 'lib';

const TokenKey = 'Admin-Token';

export function getToken() {
    return t.getLocal(TokenKey);
}

export function setToken(token) {
    t.setLocal(TokenKey, token);
}

export function removeToken () {
    t.removeLocal(TokenKey);
}
