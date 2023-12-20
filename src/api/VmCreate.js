import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";

export const apiQueryResource = (param) => {
    return postRequest('/host/getFolderList', param).then(resp => {
        if (resp.code == 200) {
            message.success("资源查询成功！", 1);
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiQueryBridgeList = (param) => {
    return getRequest('/bridge/getBridgeList?hostId=' + param).then(resp => {
        if (resp.code == 200) {
            message.success("桥接网卡列表查询成功!");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiCreateVirtual = (param) => {
    return postRequest('/vm/createByXml', param).then(resp => {
        if (resp.code == 200) {
            message.success("虚拟机创建成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}