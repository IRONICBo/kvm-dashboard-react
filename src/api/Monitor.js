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