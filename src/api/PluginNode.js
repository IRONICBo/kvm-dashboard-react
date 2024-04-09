import {getRequest, postRequest,putRequest, deleteFormRequest, postFormRequest} from "../utils/axios";
import {message} from "antd";

// evaluate node insert full
export const apiInsertAllEvaluateNode = (params) => {
    return postRequest('/evaluate/node/insert/full', params).then(resp => {
        if (resp.code == 200) {
            message.success("添加成功");
            return resp.data;
        } else {
            message.error("添加失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// evaluate node query all
export const apiGetAllEvaluateNode = () => {
    return getRequest('/evaluate/node/query').then(resp => {
        if (resp.code == 200) {
            return resp.data;
        } else {
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// evaluate node delete one
export const apiDeleteEvaluateNode = (ids) => {
    // ids是array
    return deleteFormRequest('/evaluate/node/delete?ids='+ids).then(resp => {
        if (resp.code == 200) {
            message.success("删除成功");
            return resp.data;
        } else {
            message.error("删除失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// evaluate node update one
export const apiUpdateEvaluateNode = (params) => {
    return putRequest('/evaluate/node/update', params).then(resp => {
        if (resp.code == 200) {
            message.success("更新成功");
            return resp.data;
        } else {
            message.error("更新失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}

// evaluate node insert one
export const apiInsertEvaluateNode = (params) => {
    return postRequest('/evaluate/node/insert/manual', params).then(resp => {
        if (resp.code == 200) {
            message.success("添加成功");
            return resp.data;
        } else {
            message.error("添加失败");
            console.log(resp.code + ":" + resp.message);
        }
    })
}


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

