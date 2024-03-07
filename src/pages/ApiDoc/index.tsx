import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";

const ApiDoc: React.FC = () => {
    let navigate = useNavigate();
    let Origin = window.location.hostname;
    useEffect(() => {
        // 重定向到http://localhost:28080/api/doc.html#/home
        // 获取当前域名，并且拼接重定向到当前域名的28080的/api/doc.html#/home
        // const URL = Origin + ":28080/api/doc.html#/home";
        // window.open(URL, "_blank");
    }, []);

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    return (
        <>
            <iframe src={"http://"+ Origin + ":28080/api/doc.html#/home"} width="100%" height="1000px" title="Iframe Example"></iframe>
        </>
    );
};
export default ApiDoc;