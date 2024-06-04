import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";

export const apiQueryInstanceOfferingListPage = (pageCurrent, pageSize) => {
    return getRequest('/manage/instanceOfferingInfo/pageQuery", "?pageCurrent='+pageCurrent+"&pageSize="+pageSize).then(resp => {
        if (resp.code == 200) {
            message.success("查询计算规格信息列表成功", 1);
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiQueryInstanceOfferingList = () => {
    return getRequest('/manage/instanceOfferingInfo/query').then(resp => {
        if (resp.code == 200) {
            message.success("查询计算规格信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiInstanceOfferingCreate = (data) => {
    return postRequest('/manage/instanceOfferingInfo/create', data).then(resp => {
        if (resp.code == 200) {
            message.success("创建计算规格信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiInstanceOfferingDelete = (threeNetworkUuid) => {
    return getRequest('/manage/instanceOfferingInfo/delete?uuid='+threeNetworkUuid).then(resp => {
        if (resp.code == 200) {
            message.success("删除计算规格信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}