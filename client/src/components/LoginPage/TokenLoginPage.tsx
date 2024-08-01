import { useEffect, useState } from 'react';
import styles from './LoginPage.module.css';
import axios from 'axios';
import { api, API_URL } from '../../http/http';
import { User } from '../../models/User';
import { UserInfo } from '../UserInfo/UserInfo';
import { Button } from '../UI/Button/Button';

export function TokenLoginForm() {

    const [user, setUser] = useState<User>({} as User);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (localStorage.getItem("token")) {
            api.post('/token/refresh')
            .then(res => {
                localStorage.setItem("token", res.data.accessToken);
                setUser(res.data.user);
            });
        };
    }, []);

    function registrateFunc() {
        axios.post(`${API_URL}/token/registrate`, { login, password }, { withCredentials: true })
            .then((res) => {
                localStorage.setItem("token", res.data.accessToken);
                setUser(res.data.user);
                setLogin("");
                setPassword("");
            });
    };

    function loginFunc() {
        axios.post(`${API_URL}/token/login`, { login, password }, { withCredentials: true })
            .then((res) => {
                localStorage.setItem("token", res.data.refreshToken);
                setUser(res.data.user);
                setLogin("");
                setPassword("");
            });
    };

    function logout() {
        api.post('/token/logout', {})
            .then(() => {
                localStorage.removeItem("token");
                setUser({} as User)
            });
    };

    return (
        <>
            <form className={styles.loginForm}>
                <label className={styles.loginLabel}>
                    <span>Введите логин</span>
                    <input className={styles.loginInput} value={login} onChange={e => setLogin(e.target.value)}></input>
                </label>
                <label className={styles.loginLabel}>
                    <span>Введите пароль</span>
                    <input className={styles.loginInput} type='password' value={password} onChange={e => setPassword(e.target.value)}></input>
                </label>
                <div className={styles.loginButtons}>
                    <Button text='Войти' onClickFunc={e => {
                        e.preventDefault();
                        loginFunc();
                    }}></Button>
                    <Button text='Зарегистрироваться' onClickFunc={e => {
                        e.preventDefault();
                        registrateFunc();
                    }}></Button>
                </div>
            </form>

            {user.login ?
                <div className={styles.userInfo}>
                    <UserInfo user={user} />
                    <Button text='Выйти' onClickFunc={logout}></Button>
                </div>
                : null
            }

            {localStorage.getItem("token") ?
                <div className={styles.tokenInfo}>{`accessToken: ${localStorage.getItem("token")}`}</div>
                : null
            }
        </>
    )
}