import { User } from '../../models/User';

type UserInfoProps = {
    user: User
}

export function UserInfo({ user }: UserInfoProps) {
    return (
        <table>
            <tr>
                <td>ID пользователя:</td>
                <td>{user.id}</td>
            </tr>
            <tr>
                <td>Имя пользователя:</td>
                <td>{user.login}</td>
            </tr>
            <tr>
                <td>Дата регистрации:</td>
                <td>{user.registration_date}</td>
            </tr>
        </table>
    )
}