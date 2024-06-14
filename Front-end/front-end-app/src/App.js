import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
const Home = lazy(() => import('./containers/HomePage'));
const AuthCallback = lazy(() => import('./auth/AuthCallback'));
const MainSection = lazy(() => import('./components/MainSection'));


function App() {
    return (
        <>
        <Login />
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth/kakao/callback" element={<AuthCallback />} />
                    <Route path="/main" element={<MainSection />} />

                </Routes>
            </Suspense>
        </Router>

        </>
    );
}

export default App;
