import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";

export const apiCreateVM = (data) => {
    return postRequest('/manage/vmInfo/create', data).then(resp => {
        if (resp.code == 200) {
            message.success("宿主机新增成功！");
        } else {
            message.error(resp.code + ":" + resp.message);
        }
        return resp.code;
    })
}

export const apiChangeInstanceOffering = (vmUuid, instanceUuid) => {
    return getRequest('/manage/vmInfo/changeInstanceOffering?vmUuid='+vmUuid+"&instanceUuid="+instanceUuid).then(resp => {
        if (resp.code == 200) {
            message.success("宿主机新增成功！");
        } else {
            message.error(resp.code + ":" + resp.message);
        }
        return resp.code;
    })
}

export const apiQueryVmList = () => {
    return getRequest('/manage/vmInfo/query').then(resp => {
        if (resp.code == 200) {
            message.success("虚拟机列表查询成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiVmStart = (vmUuid) => {
    return getRequest('/manage/vmInfo/start?vmUuid='+vmUuid).then(resp => {
        if (resp.code == 200) {
            message.success("虚拟机启动成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiVmStop = (vmUuid) => {
    return getRequest('/manage/vmInfo/stop?vmUuid='+vmUuid).then(resp => {
        if (resp.code == 200) {
            message.success("虚拟机停止成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiVmPause = (vmUuid) => {
    return getRequest('/manage/vmInfo/pause?vmUuid='+vmUuid).then(resp => {
        if (resp.code == 200) {
            message.success("虚拟机暂停成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiVmResume = (vmUuid) => {
    return getRequest('/manage/vmInfo/resume?vmUuid='+vmUuid).then(resp => {
        if (resp.code == 200) {
            message.success("虚拟机恢复成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiDeleteVm = (hostId) => {
    return getRequest('/manage/vmInfo/delete?vmUuid=', hostId).then(resp => {
        if (resp.code == 200) {
            message.success("虚拟机删除查询成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}


export const apiVmLiveMigrate = (vmUuid, hostUuid) => {
    return getRequest('/manage/vmInfo/liveMigrate?vmUuid='+vmUuid+"&hostUuid="+hostUuid).then(resp => {
        if (resp.code == 200) {
            message.success("虚拟机热迁移启动成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiVmOfflineMigrate = (vmUuid, hostUuid) => {
    return getRequest('/manage/vmInfo/offlineMigrate?vmUuid='+vmUuid+"&hostUuid="+hostUuid).then(resp => {
        if (resp.code == 200) {
            message.success("虚拟机冷迁移启动成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}