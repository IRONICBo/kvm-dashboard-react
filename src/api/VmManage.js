import {getRequest} from "../utils/axios";
import {message} from "antd";

export const apiQueryVmList = () => {
    return getRequest('/vm/getList').then(resp => {
        if (resp.code == 200) {
            message.success("虚拟机列表查询成功！");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}