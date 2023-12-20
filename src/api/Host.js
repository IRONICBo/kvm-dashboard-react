import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";



export const apiRefreshHostList = () => {
    return getRequest('/manage/hostInfo/queryAll').then(resp => {
        if (resp.code == 200) {
            message.success("刷新成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiDeleteHost = (hostId) => {
    return postRequest('/host/delete?hostId=' + hostId).then(resp => {
        if (resp.code == 200) {
            message.success("删除成功！");
        } else {
            message.error(resp.code + ":" + resp.message);
        }
        return resp.code;
    })
}
export const apiAddHost = (data) => {
    return postRequest('/host/create', data).then(resp => {
        if (resp.code == 200) {
            message.success("宿主机新增成功！");
        } else {
            message.error(resp.code + ":" + resp.message);
        }
        return resp.code;
    })
}

export const apiUpdateHost = (data) => {
    return postRequest('/host/update', data).then(resp => {
        if (resp.code == 200) {
            message.success("宿主机信息修改成功！");
        } else {
            message.error(resp.code + ":" + resp.message);
        }
        return resp.code;
    })
}

export const apiGetHostList = () => {
    return getRequest('/manage/hostInfo/queryAll').then(resp => {
        if (resp.code == 200) {
            message.success("获取物理机信息成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}