import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";

export const apiQueryDiskOfferingListPage = (pageCurrent, pageSize) => {
    return getRequest('/manage/diskOfferingInfo/pageQuery", "?pageCurrent='+pageCurrent+"&pageSize="+pageSize).then(resp => {
        if (resp.code == 200) {
            message.success("查询云盘规格信息列表成功", 1);
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiQueryDiskOfferingList = () => {
    return getRequest('/manage/diskOfferingInfo/query').then(resp => {
        if (resp.code == 200) {
            message.success("查询云盘规格信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiQueryPrimaryStorageList = () => {
    return getRequest('/manage/primaryStorage/list').then(resp => {
        if (resp.code == 200) {
            message.success("查询云盘规格信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiDiskOfferingCreate = (data) => {
    return postRequest('/manage/diskOfferingInfo/create', data).then(resp => {
        if (resp.code == 200) {
            message.success("创建云盘规格信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiDiskOfferingDelete = (threeNetworkUuid) => {
    return postRequest('/manage/diskOfferingInfo/delete', threeNetworkUuid).then(resp => {
        if (resp.code == 200) {
            message.success("删除云盘规格信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}