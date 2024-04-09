import {getRequest, postRequest,putRequest, deleteFormRequest, postFormRequest} from "../utils/axios";
import {message} from "antd";

// Query all plugin list
// 查询类型：(null-All、0-未定、1-存储、2-计算)
export const apiGetPlugCardList = (cardType) => {
    return getRequest('/plugCard/queryList?cardType='+cardType).then(resp => {
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
// 插件类型（0-未定、1-存储、2-计算）
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

// plugExecRecord query
export const apiGetPlugExecRecord = (plugId) => {
    return getRequest('/plugExecRecord/query?plugId='+plugId).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// plugState start
export const apiStartPlugState = (params) => {
    return postRequest('/plugState/start', params).then(resp => {
        if (resp.code == 200) {
            message.success("启动成功");
            return resp.data;
        } else {
            message.error("启动失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// plugState stop
export const apiStopPlugState = (params) => {
    return postRequest('/plugState/stop', params).then(resp => {
        if (resp.code == 200) {
            message.success("停止成功");
            return resp.data;
        } else {
            message.error("停止失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// plugState query
export const apiGetPlugState = (id) => {
    return getRequest('/plugState/query?recordId='+id).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// plugResultFile/queryByStateId 
export const apiGetPlugResultFile = (id) => {
    return getRequest('/plugResultFile/queryByStateId?stateId='+id).then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// plugResultFile/download/single
export const apiDownloadPlugResultFile = (id) => {
    return getRequest('/plugResultFile/download/single?id='+id).then(resp => {
        console.log(resp);
    })
    // 返回请求地址getRequest中的url地址
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