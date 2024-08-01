import { NavLink, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import { CookiesLoginForm } from './components/LoginPage/CookiesLoginPage';
import { TokenLoginForm } from './components/LoginPage/TokenLoginPage';
import { OAuthLoginForm } from './components/LoginPage/OAuthLoginPage';

function App() {

  return (
    <>
    <header className='navigate'>
      <NavLink to={'/'}>Сookies</NavLink>
      <NavLink to={'/token'}>Token</NavLink>
      <NavLink to={'/oauth'}>OAuth</NavLink>
    </header>
      <Routes>
        <Route path='/' element={<CookiesLoginForm />}></Route>
        <Route path='/token' element={<TokenLoginForm />}></Route>
        <Route path='/oauth' element={<OAuthLoginForm />}></Route>
      </Routes>
      <Outlet></Outlet>
    </>
  )
}

export default App
