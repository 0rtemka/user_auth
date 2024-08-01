import { useEffect, useState } from 'react';
import styles from './LoginPage.module.css';
import axios from 'axios';
import { API_URL } from '../../http/http';
import { User } from '../../models/User';
import { UserInfo } from '../UserInfo/UserInfo';
import { Button } from '../UI/Button/Button';

export function CookiesLoginForm() {

    const [user, setUser] = useState<User>({} as User);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (localStorage.getItem("sessionId")) {
            getUserInfo();
        }
    }, []);

    function getUserInfo() {
        axios.get(`${API_URL}/cookie/userinfo`, { withCredentials: true })
            .then(res => {
                const user = res.data;
                if (user)
                    setUser(res.data);
                else
                    setUser({} as User);
            })
    }

    function registrateFunc() {
        axios.post(`${API_URL}/cookie/registrate`, { login, password }, { withCredentials: true })
            .then((res) => {
                localStorage.setItem("sessionId", res.data.sessionId);
                getUserInfo();
                setLogin("");
                setPassword("");
            });
    };

    function loginFunc() {
        axios.post(`${API_URL}/cookie/login`, { login, password }, { withCredentials: true })
            .then((res) => {
                localStorage.setItem("sessionId", res.data.sessionId);
                getUserInfo();
                setLogin("");
                setPassword("");
            });
    };

    function logout() {
        axios.post(`${API_URL}/cookie/logout`, {}, { withCredentials: true })
            .then(() => {
                localStorage.removeItem("sessionId");
                setUser({} as User)
            })
    }

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

            {localStorage.getItem("sessionId") ?
                <span>{`sessionId: ${localStorage.getItem("sessionId")}`}</span>
                : null
            }
        </>
    )
}