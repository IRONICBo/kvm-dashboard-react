import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";

export const apiQueryVolumeListPage = (pageCurrent, pageSize) => {
    return getRequest('/manage/dataVolumeInfo/pageQuery", "?pageCurrent='+pageCurrent+"&pageSize="+pageSize).then(resp => {
        if (resp.code == 200) {
            message.success("查询数据盘信息列表成功", 1);
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiQueryVolumeList = () => {
    return getRequest('/manage/dataVolumeInfo/query').then(resp => {
        if (resp.code == 200) {
            message.success("查询数据盘信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiVolumeCreate = (data) => {
    return postRequest('/manage/dataVolumeInfo/create', data).then(resp => {
        if (resp.code == 200) {
            message.success("创建数据盘信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiVolumeDelete = (Uuid) => {
    return getRequest('/manage/dataVolumeInfo/delete?dataVolumeUuid=', Uuid).then(resp => {
        if (resp.code == 200) {
            message.success("删除数据盘信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiVolumeExpand = (volumeUuid, size) => {
    return getRequest('/manage/dataVolumeInfo/expandVolume?volumeUuid='+volumeUuid+"&size="+size).then(resp => {
        if (resp.code == 200) {
            message.success("扩容数据盘信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}