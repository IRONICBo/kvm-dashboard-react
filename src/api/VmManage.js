import {getRequest} from "../utils/axios";
import {message} from "antd";

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
