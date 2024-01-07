import {getRequest, postRequest, postFormRequest} from "../utils/axios";
import {message} from "antd";

export const apiAddServiceMonitor = (data) => {
    return postRequest('/monitor/serviceMonitor/add', data).then(resp => {
        if (resp.code == 200) {
            message.success("新增服务监控成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiDeleteServiceMonitor = (id) => {
    return getRequest('/monitor/serviceMonitor/delete?id=' + id).then(resp => {
        if (resp.code == 200) {
            message.success("服务监控删除成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiReplaceService = (data) => {
    return postRequest('/monitor/serviceMonitor/manualReplace', data).then(resp => {
        if (resp.code == 200) {
            message.success("服务替换成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetServiceList = () => {
    return getRequest('/monitor/serviceMonitor/query').then(resp => {
        if (resp.code == 200) {
            message.success("服务监控列表查询成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetAllServiceList = (machineType, machineUuid) => {
    // 1:宿主机、2:虚拟机
    return getRequest('/monitor/serviceMonitor/query/allService?machineType=' + machineType + "&machineUuid=" + machineUuid).then(resp => {
        if (resp.code == 200) {
            message.success("查询所有状态服务列表成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetRunningServiceList = (machineType, machineUuid) => {
    // 1:宿主机、2:虚拟机
    return getRequest('/monitor/serviceMonitor/query/runningService?machineType=' + machineType + "&machineUuid=" + machineUuid).then(resp => {
        if (resp.code == 200) {
            message.success("查询运行状态服务列表成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiUpdateServiceMonitor = (data) => {
    return postRequest('/monitor/serviceMonitor/update', data).then(resp => {
        if (resp.code == 200) {
            message.success("更新服务监控成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}