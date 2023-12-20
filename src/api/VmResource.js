import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";

export const apiExtendCPU = (param) => {
    return getRequest('/resource/allocation/expandCpu?vmUuid=', param).then(resp => {
        if (resp.code == 200) {
            message.success("扩展CPU成功！", 1);
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiReduceCPU = (param) => {
    return getRequest('/resource/allocation/reduceCpu?vmUuid=' + param).then(resp => {
        if (resp.code == 200) {
            message.success("缩减CPU成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiExtendMem = (param) => {
    return getRequest('/resource/allocation/expandMemory?vmUuid=', param).then(resp => {
        if (resp.code == 200) {
            message.success("扩展Mem成功！", 1);
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiReduceMem = (param) => {
    return getRequest('/resource/allocation/reduceMemory?vmUuid=' + param).then(resp => {
        if (resp.code == 200) {
            message.success("缩减Mem成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}
