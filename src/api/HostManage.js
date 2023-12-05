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
    return postRequest('/manage/hostInfo/delete?hostId=' + hostId).then(resp => {
        if (resp.code == 200) {
            message.success("删除成功！");
        } else {
            message.error(resp.code + ":" + resp.message);
        }
        return resp.code;
    })
}
export const apiAddHost = (data) => {
    return postRequest('/manage/hostInfo/create', data).then(resp => {
        if (resp.code == 200) {
            message.success("宿主机新增成功！");
        } else {
            message.error(resp.code + ":" + resp.message);
        }
        return resp.code;
    })
}

export const apiUpdateHost = (data) => {
    return postRequest('/manage/hostInfo/updateBasic', data).then(resp => {
        if (resp.code == 200) {
            message.success("宿主机信息修改成功！");
        } else {
            message.error(resp.code + ":" + resp.message);
        }
        return resp.code;
    })
}

export const apiUpdateHostSSH = (data) => {
    return postRequest('/manage/hostInfo/updateSsh', data).then(resp => {
        if (resp.code == 200) {
            message.success("SSH信息修改成功！");
        } else {
            message.error(resp.code + ":" + resp.message);
        }
        return resp.code;
    })
}

export const apiGetSimpleHostList = () => {
    return getRequest('/manage/hostInfo/queryAll').then(resp => {
        if (resp.code == 200) {
            message.success("获取配置信息成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}