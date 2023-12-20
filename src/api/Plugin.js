import {getRequest, postRequest, postFormRequest} from "../utils/axios";
import {message} from "antd";

export const apiPluginUpload = (formData) => {
    return postFormRequest('/plugInfo/upload', formData).then(resp => {
        if (resp.code == 200) {
            message.success("上传成功");
            return resp.data;
        } else {
            message.error("上传失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetPluginInfo = () => {
    return getRequest('/plugInfo/getInfo').then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

export const apiRunPlugin = (params) => {
    return postRequest('/plugState/run', params).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

export const apiGetPluginResp = (params) => {
    return getRequest('/plugState/queryFinishState?plugStateId='+params).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}
