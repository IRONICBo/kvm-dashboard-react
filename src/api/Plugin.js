import {getRequest, postRequest,putRequest, deleteFormRequest, postFormRequest} from "../utils/axios";
import {message} from "antd";

// Query all plugin list
export const apiGetPlugCardList = () => {
    return getRequest('/plugCard/queryList').then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// Update plugin card
export const apiUpdatePlugCard = (params) => {
    // {
    //     "cardDescription": "",
    //     "cardName": "",
    //     "cardZzid": 0
    // }
    return putRequest('/plugCard/updateOne', params).then(resp => {
        if (resp.code == 200) {
            message.success("更新成功");
            return resp.data;
        } else {
            message.error("更新失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// Delete plugin card
export const apiDeletePlugCard = (id) => {
    return deleteFormRequest('/plugCard/deleteOne?id='+id).then(resp => {
        if (resp.code == 200) {
            message.success("删除成功");
            return resp.data;
        } else {
            message.error("删除失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// Add plugin card
export const apiAddPlugCard = (params) => {
    // {
    //     "cardDescription": "",
    //     "cardName": ""
    // }
    return postRequest('/plugCard/add', params).then(resp => {
        if (resp.code == 200) {
            message.success("添加成功");
            return resp.data;
        } else {
            message.error("添加失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// Pluginfo deleteOne
export const apiDeletePlugInfo = (id) => {
    return deleteFormRequest('/plugInfo/deleteOne?plugId='+id).then(resp => {
        if (resp.code == 200) {
            message.success("删除成功");
            return resp.data;
        } else {
            message.error("删除失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// Pluginfo insert
export const apiAddPlugInfo = (params) => {
    // files: （二进制）
    // plugCardId: 1
    // plugResultType: FILE
    // plugStartCommand: bash 1.txt
    // plugType: COMMAND_PARAM
    // plugVersionDescription: 1
    // plugVersionName: 1
    return postFormRequest('/plugInfo/insert', params).then(resp => {
        if (resp.code == 200) {
            message.success("添加成功");
            return resp.data;
        } else {
            message.error("添加失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// Pluginfo queryByCardId
export const apiGetPlugInfoByCardId = (id) => {
    return getRequest('/plugInfo/queryByCardId?plugCardId='+id).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// plugParam queryById
export const apiGetPlugParamByPlugId = (id) => {
    return getRequest('/plugParam/queryById?plugId='+id).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// plugParam insert
export const apiAddPlugParam = (params) => {
    // {
    //     "plugId": 0,
    //     "plugParamList": [
    //       {
    //         "paramDefaultValue": "",
    //         "paramDescription": "",
    //         "paramKey": "",
    //         "paramRequire": 0
    //       }
    //     ]
    //   }
    return postRequest('/plugParam/insert', params).then(resp => {
        if (resp.code == 200) {
            message.success("添加成功");
            return resp.data;
        } else {
            message.error("添加失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// plugParam deleteOne
export const apiDeletePlugParam = (id) => {
    return deleteFormRequest('/plugParam/deleteOne?paramId='+id).then(resp => {
        if (resp.code == 200) {
            message.success("删除成功");
            return resp.data;
        } else {
            message.error("删除失败");
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

export const apiTestPlugin = (params) => {
    return postRequest('/plugInfo/selector', params).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}