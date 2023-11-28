import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";

export const apiQueryThreeNetworkInfoListPage = (pageCurrent, pageSize) => {
    return getRequest('/manage/threeNetworkInfo/pageQuery", "?pageCurrent='+pageCurrent+"&pageSize="+pageSize ).then(resp => {
        if (resp.code == 200) {
            message.success("查询三层网络信息列表成功", 1);
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiQueryThreeNetworkInfoList = () => {
    return getRequest('/manage/threeNetworkInfo/query').then(resp => {
        if (resp.code == 200) {
            message.success("查询三层网络信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}