import {getRequest, postRequest, postFormRequest} from "../utils/axios";
import {message} from "antd";

export const apiSetRetentionTime = (data) => {
    return postFormRequest('/monitor/setRetentionTime', data).then(resp => {
        if (resp.code == 200) {
            message.success("数据持久化修改查询成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetRetentionTime = () => {
    return getRequest('/monitor/queryRetention').then(resp => {
        if (resp.code == 200) {
            message.success("数据持久化查询查询成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetSystemConfig = () => {
    return getRequest('/web/config/queryAll').then(resp => {
        if (resp.code == 200) {
            message.success("系统配置查询成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiSetSystemConfig = (key, value) => {
    return getRequest('/web/config/modify' + "?key=" + key + "&value=" + value).then(resp => {
        if (resp.code == 200) {
            message.success("数据持久化更新查询成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}