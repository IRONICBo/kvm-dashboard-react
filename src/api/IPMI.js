import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";

export const apiQueryIPMILog = (ip, port) => {
    return getRequest('/monitor/ipmiLogInfo/query?ip='+ip+"&port="+port).then(resp => {
        if (resp.code == 200) {
            message.success("查询成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}
