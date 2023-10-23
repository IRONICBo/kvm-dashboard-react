import {getRequest, postRequest} from "../utils/axios";
import {message} from "antd";

export const apiPluginUpload = (formData) => {
    console.log(formData)
    return postRequest('/plugin/upload').then(resp => {
        if (resp.code == 200) {
            message.success("上传成功");
            return resp.data;
        } else {
            message.error("上传失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}
