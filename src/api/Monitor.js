import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";

export const apiGetGuestInfos = (uuid) => {
    return getRequest('/guestInfos/queryById?uuid=' + uuid).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetKeySet = (statType) => {
    return getRequest('/monitor/getKeySet?statType=' + statType).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetMetricAgg = (aggFn, aggPeriod, startTime, endTime, field, uuid) => {
    return getRequest('/monitor/queryAgg?aggFn=' + aggFn
     + '&aggPeriod=' + aggPeriod
     + '&startTime=' + startTime
     + '&endTime=' + endTime
     + '&field=' + field
     + '&uuid=' + uuid).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetCacheData = (statType, uuid) => {
    return getRequest('/monitor/getCacheData?statType=' + statType + '&uuid=' + uuid).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetMetricPage = (endTime, field, n, offset, startTime, uuid) => {
    return getRequest('/monitor/queryPage?endTime=' + endTime
     + '&field=' + field
     + '&n=' + n
     + '&offset=' + offset
     + '&startTime=' + startTime
     + '&uuid=' + uuid).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetAlertPage = (uuid, pageCurrent, pageSize) => {
    return getRequest('/alarmInfo/pageList?'
    //  + '&uuid=' + uuid
     + 'pageCurrent=' + pageCurrent
     + '&pageSize=' + pageSize).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetMachineAlertPage = (uuid, pageCurrent, pageSize) => {
    return getRequest('/alarmInfo/pageListById?'
     + '&uuid=' + uuid
     + '&pageCurrent=' + pageCurrent
     + '&pageSize=' + pageSize).then(resp => {
        if (resp.code == 200) {
            // data: {}, "current": 1, "size": 10, "total": 17
            return resp;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetEvaluateData = () => {
    return getRequest('/monitor/getEvaluateData').then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

export const apiStartHostMonitor = (data) => {
    let dataList = {
        "hostUuidList": data,
        "vmUuidList": [],
    }
    return postRequest('/go/start', dataList).then(resp => {
        if (resp.code == 200) {
            message.success("请求启动成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiStopHostMonitor = (data) => {
    let dataList = {
        "hostUuidList": data,
        "vmUuidList": [],
    }
    return postRequest('/go/stop', dataList).then(resp => {
        if (resp.code == 200) {
            message.success("请求停止成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiStartVMMonitor = (data) => {
    let dataList = {
        "hostUuidList": [],
        "vmUuidList": data,
    }
    return postRequest('/go/start', dataList).then(resp => {
        if (resp.code == 200) {
            message.success("请求启动成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiStopVMMonitor = (data) => {
    let dataList = {
        "hostUuidList": [],
        "vmUuidList": data,
    }
    return postRequest('/go/stop', dataList).then(resp => {
        if (resp.code == 200) {
            message.success("请求停止成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}