import {getRequest, postFormUrlencodedRequest, postRequest} from "../utils/axios";
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
    return getRequest('/manage/hostInfo/delete?hostId='+ hostId).then(resp => {
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

export const apiStopHost = (data) => {
    return getRequest('/manage/hostInfo/stop?hostUuid='+data).then(resp => {
        if (resp.code == 200) {
            message.success("宿主机停用成功！");
        } else {
            message.error(resp.code + ":" + resp.message);
        }
        return resp.code;
    })
}

export const apiStartHost = (data) => {
    return getRequest('/manage/hostInfo/start?hostUuid='+data).then(resp => {
        if (resp.code == 200) {
            message.success("宿主机启用成功！");
        } else {
            message.error(resp.code + ":" + resp.message);
        }
        return resp.code;
    })
}

export const apiUpdateHost = (data) => {
    return postFormUrlencodedRequest('/manage/hostInfo/updateBasic', data).then(resp => {
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

export const apiGetRecommendHost = () => {
    return getRequest('/manage/hostInfo/getBestHealthHostl').then(resp => {
        if (resp.code == 200) {
            message.success("获取推荐成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetHostCPUAvailable = (hostUuid) => {
    return getRequest('/manage/hostInfo/getHostAllCpuAvailableRate?hostUuid='+hostUuid).then(resp => {
        if (resp.code == 200) {
            message.success("查询物理机CPU空闲率");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetHostCPUUsed = (hostUuid) => {
    return getRequest('/manage/hostInfo/getHostAllCpuUsedRate?hostUuid='+hostUuid).then(resp => {
        if (resp.code == 200) {
            message.success("查询物理机CPU使用率");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetMemUsedBytes = (hostUuid) => {
    return getRequest('/manage/hostInfo/getHostMemoryUsedBytes?hostUuid='+hostUuid).then(resp => {
        if (resp.code == 200) {
            message.success("查询物理机CPU空闲率");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetMemUsedRate = (hostUuid) => {
    return getRequest('/manage/hostInfo/getMemoryUsedInPercent?hostUuid='+hostUuid).then(resp => {
        if (resp.code == 200) {
            message.success("查询物理机CPU使用率");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}