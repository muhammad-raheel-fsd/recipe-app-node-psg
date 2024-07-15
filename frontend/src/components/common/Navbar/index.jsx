import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../css/navbar.css';
import { useCookies } from 'react-cookie';
import UserInformation from './UserInformation';

const Navbar = () => {
    const [cookies, removeCookie] = useCookies();
    const [userExist, setUserExist] = useState();

    useEffect(() => {
        if (cookies.auth !== undefined) {
            setUserExist(true);
        }
        else
            setUserExist(false);
    }, [])

    const location = useLocation();
    const pathname = location.pathname.replace(/^\//, '');

    const paths = ["home", "restaurant", "recipes", "favorites", "categories"];
    useEffect(() => {
        paths.forEach(path => {
            const element = document.getElementById(path);
            if (element) {
                element.style.color = path === pathname ? "#057dcd" : "white";
            }
        });
    }, [pathname, paths]);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link id='home-link' to="/" className="navbar-brand">
                        Recipedia
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-controls="navbar-default"
                        aria-expanded={isOpen}
                    >
                        <svg className="navbar-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className={`navbar-menu ${isOpen ? 'open' : ''}`} id="navbar-default">
                        <ul className="navbar-nav">
                            {paths.map(path => (
                                <li key={path} className="nav-item">
                                    <Link
                                        id={path}
                                        to={`/${path}`}
                                        className="nav-link"
                                        aria-current={pathname === path ? "page" : undefined}
                                    >
                                        {path.charAt(0).toUpperCase() + path.slice(1)}
                                    </Link>
                                </li>
                            ))}
                            <li className="nav-item">
                                {
                                    userExist ? (
                                        <UserInformation cookies={cookies} removeCookie={removeCookie}/>
                                    ) : (
                                        <Link
                                            id="signup"
                                            to="/auth/login"
                                            className="nav-link login-link"
                                            aria-current={pathname === "auth/login" ? "page" : undefined}
                                        >
                                            Login
                                        </Link>
                                    )
                                }
                                {/* <Link
                                    id="signup"
                                    to="/auth/login"
                                    className="nav-link login-link"
                                    aria-current={pathname === "auth/login" ? "page" : undefined}
                                >
                                    Login
                                </Link> */}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div
                id="drawer"
                className={`drawer ${isOpen ? 'open' : ''}`}
                tabIndex={-1}
                aria-labelledby="drawer-label"
            >
                <Link to="/" className="drawer-header">
                    Recipedia
                </Link>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="drawer-close"
                >
                    <svg className="drawer-close-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                </button>
                <div className="drawer-content">
                    <ul className="drawer-nav">
                        {paths.map(path => (
                            <li key={path} className="drawer-item" onClick={() => setIsOpen(false)}>
                                <Link
                                    id={path}
                                    to={`/${path}`}
                                    className="drawer-link"
                                    aria-current={pathname === path ? "page" : undefined}
                                >
                                    {path.charAt(0).toUpperCase() + path.slice(1)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;