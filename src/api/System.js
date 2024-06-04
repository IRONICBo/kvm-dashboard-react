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

// System backup
export const apiSetBackup = (data) => {
    // data = {type: 1, 2}
    return postFormRequest('/web/backupInfo/backup', data).then(resp => {
        if (resp.code == 200) {
            message.success("系统备份成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiQueryBackup = () => {
    return getRequest('/web/backupInfo/queryAll').then(resp => {
        if (resp.code == 200) {
            message.success("系统备份查询成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiDeleteBackup = (ids) => {
    return getRequest('/web/backupInfo/delete?ids=' + ids).then(resp => {
        if (resp.code == 200) {
            message.success("系统备份删除成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiReverBackup = (data) => {
    // data = {id: 1}
    return postFormRequest('/web/backupInfo/restore', data).then(resp => {
        if (resp.code == 200) {
            message.success("系统恢复成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}