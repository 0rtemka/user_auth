import { useEffect, useState } from 'react';
import styles from './LoginPage.module.css';
import axios from 'axios';
import { API_URL } from '../../http/http';
import { User } from '../../models/User';
import { UserInfo } from '../UserInfo/UserInfo';
import { Button } from '../UI/Button/Button';

export function OAuthLoginForm() {

    const [user, setUser] = useState<User>({} as User);

    useEffect(() => {
        getUserInfo();
    }, []);

    function getUserInfo() {
        axios.get(`${API_URL}/oauth/userinfo`, { withCredentials: true })
            .then(res => {
                const user = res.data;
                if (user)
                    setUser(res.data);
                else
                    setUser({} as User);
            })
    }

    function logout() {
        axios.post(`${API_URL}/oauth/logout`, {}, { withCredentials: true })
            .then(() => {
                setUser({} as User)
            })
    }

    return (
        <>
            <a href='http://localhost:5000/oauth/auth'><button className={styles.button}>Войти с Google</button></a>

            {user.login ?
                <div className={styles.userInfo}>
                    <UserInfo user={user} />
                    <Button text='Выйти' onClickFunc={logout}></Button>
                </div>
                : null
            }
        </>
    )
}