import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/">Главная</Link>
      {!token && <Link to="/login">Вход</Link>}
      {!token && <Link to="/register">Регистрация</Link>}
      {token && role === 'admin' && <Link to="/admin">Админ панель</Link>}
      {token && role === 'admin' && <Link to="/admin/dataset-config">Настройка набора данных</Link>}
      {token && <button onClick={handleLogout} className="btn">Выйти</button>}
    </nav>
  );
};

export default Navbar;