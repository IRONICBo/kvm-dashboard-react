import axios from 'axios'
import {message} from "antd";

//响应拦截器
axios.interceptors.response.use(success => {
    if (success == null || success == undefined || success.data == null || success.data == undefined) {
        console.log("success is null or undefined");
        return;
    }

    console.log(success.data);
    return success.data;
}, error => {
    if (error == null || error == undefined || error.response == null || error.response == undefined) {
        console.log("error is null or undefined");
        return;
    }

    console.error(error.response.data);
    return error.response.data;
});


let base = 'http://' + window.location.hostname + ':28080/api';

// 传送form格式的post请求
export const postFormRequest = (url, params) => {
    return axios({
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'post',
        url: `${base}${url}`,
        data: params,
        withCredentials: true,
    })
}

// 传送FormUrlencoded格式的post请求
export const postFormUrlencodedRequest = (url, params) => {
    return axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        url: `${base}${url}`,
        data: params,
        withCredentials: true,
    })
}

//传送json格式的post请求
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        withCredentials: true,
    })
}

//传送json格式的put请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        withCredentials: true,
    })
}

//传送json格式的get请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params,
        withCredentials: true,
    })
}

//传送json格式的delete请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params,
        withCredentials: true,
    })
}

// delete form data
export const deleteFormRequest = (url, params) => {
    return axios({
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        method: 'delete',
        url: `${base}${url}`,
        data: params,
        withCredentials: true,
    })
}