import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";

export const apiQueryMirrorListPage = (pageCurrent, pageSize) => {
    return getRequest('/manage/mirrorInfo/query", "?pageCurrent='+pageCurrent+"&pageSize="+pageSize).then(resp => {
        if (resp.code == 200) {
            message.success("查询镜像信息列表成功", 1);
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiQueryMirrorList = () => {
    return getRequest('/manage/mirrorInfo/query').then(resp => {
        if (resp.code == 200) {
            message.success("查询镜像信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiMirrorCreate = (data) => {
    return postRequest('/manage/mirrorInfo/create', data).then(resp => {
        if (resp.code == 200) {
            message.success("创建镜像信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiMirrorDelete = (threeNetworkUuid) => {
    return postRequest('/manage/mirrorInfo/delete', threeNetworkUuid).then(resp => {
        if (resp.code == 200) {
            message.success("创建镜像信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}