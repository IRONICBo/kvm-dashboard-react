import {getRequest, postRequest, postFormRequest} from "../utils/axios";
import {message} from "antd";

export const apiUserLogin = (data) => {
    return postRequest('/acc/login', data).then(resp => {
        if (resp.code == 200) {
            message.success("登录成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiUserLogout = () => {
    return getRequest('/acc/logout').then(resp => {
        if (resp.code == 200) {
            message.success("退出成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiUserRegister = (data) => {
    return postRequest('/evaluate/plugUser/register', data).then(resp => {
        if (resp.code == 200) {
            message.success("注册成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiCreateAuthGroup = (data) => {
    return postRequest('/manage/authorityGroup/create', data).then(resp => {
        if (resp.code == 200) {
            message.success("创建用户权限组成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetAuthGroup = () => {
    return getRequest('/manage/authorityGroup/query').then(resp => {
        if (resp.code == 200) {
            message.success("查询用户权限组成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiDeleteAuthGroup = () => {
    return postFormRequest('/manage/authorityGroup/deleteById').then(resp => {
        if (resp.code == 200) {
            message.success("删除用户权限组信息成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetAuthInfo = () => {
    return getRequest('/manage/authorityInfo/queryAll').then(resp => {
        if (resp.code == 200) {
            message.success("查询用户关联信息成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiCreateAuthInfo = () => {
    return postRequest('/manage/authorityInfo/create').then(resp => {
        if (resp.code == 200) {
            message.success("查询用户权限组成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiDeleteAuthInfo = (authGroupUuid, authUserUuid) => {
    return postFormRequest('/manage/authorityInfo/deleteOne?authGroupUuid='+authGroupUuid+"&authUserUuid="+authUserUuid).then(resp => {
        if (resp.code == 200) {
            message.success("删除用户权限组信息成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}