import {getRequest, postRequest, postFormUrlencodedRequest} from "../utils/axios";
import {message} from "antd";

export const apiQuerySnapshotListPage = (pageCurrent, pageSize) => {
    return getRequest('/manage/snapshotGroup/pageQueryByVmUuid", "?pageCurrent='+pageCurrent+"&pageSize="+pageSize+"&vmUuid="+vmUuid).then(resp => {
        if (resp.code == 200) {
            message.success("查询快照信息列表成功", 1);
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiQuerySnapshotList = (Uuid) => {
    return getRequest('/manage/snapshotGroup/queryByVmUuid?vmUuid='+Uuid).then(resp => {
        if (resp.code == 200) {
            message.success("查询快照信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiSnapshotCreate = (vmUuid, snapGroupName) => {
    return getRequest('/manage/snapshotGroup/createByVmId'+ "?vmUuid="+vmUuid+"&snapGroupName="+snapGroupName).then(resp => {
        if (resp.code == 200) {
            message.success("创建快照信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiSnapshotDelete = (Uuid) => {
    return getRequest('/manage/snapshotGroup/delete?snapGroupUuid='+Uuid).then(resp => {
        if (resp.code == 200) {
            message.success("删除快照信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}

export const apiSnapshotRevert = (data) => {
    return postFormUrlencodedRequest('/manage/snapshotGroup/revert', data).then(resp => {
        if (resp.code == 200) {
            message.success("恢复快照信息列表成功");
            return resp.data;
        } else {
            message.error(resp.code + ":" + resp.message);
        }
    })
}