import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Main";
import Calendar from './components/Calender';


const RouterOne = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={< Main/>} >
                        <Route index element={< Calendar/>} />
                        




                    </Route>
                </Routes>
            </BrowserRouter>
        </>


    )
}
export default RouterOne;