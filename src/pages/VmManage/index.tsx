import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form, Drawer, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag, notification, Select, Alert, Radio } from "antd";
import { ProDescriptions } from '@ant-design/pro-components';
import {ColumnsType} from "antd/es/table";
import {apiAddHost, apiRefreshHostList, apiDeleteHost, apiUpdateHost, apiUpdateHostSSH, apiGetRecommendHost, apiGetHostCPUAvailable, apiGetHostCPUUsed, apiGetMemUsedBytes, apiGetMemUsedRate } from "@/api/HostManage";
import {apiQueryVmList, apiDeleteVm, apiVmStart, apiVmStop, apiVmPause, apiVmResume, apiVmLiveMigrate, apiVmOfflineMigrate, apiCreateVM, apiChangeInstanceOffering } from "@/api/VmManage";
import {apiExtendCPU, apiExtendMem, apiReduceCPU, apiReduceMem} from "@/api/VmResource";
import {apiStartVMMonitor, apiStopVMMonitor} from "@/api/Monitor";
import { history } from 'umi';
import { RedoOutlined, PlusOutlined, PlayCircleOutlined, PauseCircleOutlined, PicRightOutlined, PicLeftOutlined } from '@ant-design/icons';
import VmSnapshotPage from "../VmSnapshot";
import { apiQueryInstanceOfferingList } from "@/api/VmInstance";
import { apiQueryDiskOfferingList, apiQueryPrimaryStorageList } from "@/api/VmDisk";
import { apiQueryThreeNetworkInfoList } from "@/api/VmNetwork";
import { apiQueryMirrorList } from "@/api/VmMirror";
import {message} from "antd";

interface DataType {
    authorityGroupUuid: string,
    autoAdjust: any,
    resourcePriority: number,
    rootDiskOfferingUuid: string,
    dataDiskOfferingUuidList: string,
    defaultL3NetworkUuid: string,
    description: string,
    hostUuid: string,
    imageUuid: string,
    instanceOfferingUuid: string,
    vmPrimaryStorageUuid: string,
    name: string,
    loginUser: string,
    loginPassword: string,
    vmSetCleanTraffic: any,
    vmSetRdp: any,
    vmSetUsb: any
}

const VmManagePage: React.FC = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'vmZzid',
            ellipsis: {
                showTitle: false,
            },
            width: 50,
            fixed: "left",
        },
        {
            title: 'UUID',
            dataIndex: 'vmUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
            render: (vmUuid) => (
                <Tooltip placement="topLeft" title={vmUuid}>
                    {/* <a onClick={(event) => {event.preventDefault();history.push("/monitor?uuid=" + hostId)}}> */}
                    <a onClick={(event) =>  {event.preventDefault();showGetDetailOpen(vmUuid)}}>
                        {vmUuid}
                    </a>
                </Tooltip>
            )
        },
        {
            title: '名称',
            dataIndex: 'vmName',
            ellipsis: {
                showTitle: false,
            },
            render: (vmName) => (
                <Tooltip placement="topLeft" title={vmName}>
                    {vmName}
                </Tooltip>
            ),
            width: 130
        },
        {
            title: '镜像ID',
            dataIndex: 'vmImageUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmImageUuid) => (
                <Tooltip placement="topLeft" title={vmImageUuid}>
                    {vmImageUuid}
                </Tooltip>
            )
        },
        {
            title: '物理机ID',
            dataIndex: 'vmHostUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmHostUuid) => (
                <Tooltip placement="topLeft" title={vmHostUuid}>
                    {vmHostUuid}
                </Tooltip>
            )
        },
        {
            title: '描述信息',
            dataIndex: 'vmDescription',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (vmDescription) => (
                <Tooltip placement="topLeft" title={vmDescription}>
                    {vmDescription == null ? "无" : vmDescription}
                </Tooltip>
            )
        },
        {
            title: '区域ID',
            dataIndex: 'vmZoneUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmZoneUuid) => (
                <Tooltip placement="topLeft" title={vmZoneUuid}>
                    {vmZoneUuid}
                </Tooltip>
            )
        },
        {
            title: '集群ID',
            dataIndex: 'vmClusterUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmClusterUuid) => (
                <Tooltip placement="topLeft" title={vmClusterUuid}>
                    {vmClusterUuid}
                </Tooltip>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'vmCreateTime',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (vmCreateTime) => (
                <Tooltip placement="topLeft" title={vmCreateTime}>
                    {vmCreateTime}
                </Tooltip>
            )
        },
        {
            title: '状态',
            dataIndex: 'vmState',
            ellipsis: {
                showTitle: false,
            },
            width: 100,
            render: (vmState) => (
                <>
                    {vmState!="Stopped" ? (
                        <Tag color="blue" key={vmState}>
                            {vmState}
                        </Tag>
                    ) : (
                        <Tag color="volcano" key={vmState}>
                            {vmState}
                        </Tag>
                    )}
                </>
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 300,
            render: (_, record) =>
                <Space>
                    <Button size={"small"} shape={"round"} type="dashed" onClick={() => showUpdateModal(record)}>编辑</Button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => deleteHost(record.vmUuid)}>
                        <Button size={"small"} shape={"round"} danger={true} type="dashed">删除</Button>
                    </Popconfirm>
                    {/*<Popconfirm title="确认扩展?" onConfirm={() => extendHost(record.vmUuid)}>
                        <Button size={"small"} shape={"round"} danger={true} type="dashed">自动扩展</Button>
                    </Popconfirm>
                    <Popconfirm title="确认缩减?" onConfirm={() => reduceHost(record.vmUuid)}>
                        <Button size={"small"} shape={"round"} danger={true} type="dashed">自动缩减</Button>
                    </Popconfirm>*/}
                    <Button size={"small"} shape={"round"}
                        onClick={() => showMigrateModal(record, 1)}>
                        热迁移
                    </Button>
                    <Button size={"small"} shape={"round"}
                        onClick={() => showMigrateModal(record, 2)}>
                        冷迁移
                    </Button>
                </Space>
        }
    ];

    const detailColumn = [
        {
            title: 'ID',
            dataIndex: 'vmZzid',
            ellipsis: {
                showTitle: false,
            },
            width: 50,
            fixed: "left",
        },
        {
            title: 'UUID',
            dataIndex: 'vmUuid',
            key: 'vmUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
            render: (vmUuid) => (
                    <a onClick={(event) => {event.preventDefault();history.push("/monitor?uuid=" + vmUuid)}}>
                        {vmUuid}
                    </a>
            )
        },
        {
            title: '名称',
            dataIndex: 'vmName',
            ellipsis: {
                showTitle: false,
            },
            render: (vmName) => (
                <Tooltip placement="topLeft" title={vmName}>
                    {vmName}
                </Tooltip>
            ),
            width: 130
        },
        {
            title: 'IP地址',
            dataIndex: 'vmNicIp',
            ellipsis: {
                showTitle: false,
            },
            render: (vmNicIp) => (
                <Tooltip placement="topLeft" title={vmNicIp}>
                    {vmNicIp}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: 'MAC地址',
            dataIndex: 'vmNicNetmask',
            ellipsis: {
                showTitle: false,
            },
            render: (vmNicNetmask) => (
                <Tooltip placement="topLeft" title={vmNicNetmask}>
                    {vmNicNetmask}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: '网关地址',
            dataIndex: 'vmNicGateway',
            ellipsis: {
                showTitle: false,
            },
            render: (vmNicGateway) => (
                <Tooltip placement="topLeft" title={vmNicGateway}>
                    {vmNicGateway}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: '账号',
            dataIndex: 'vmLoginUser',
            ellipsis: {
                showTitle: false,
            },
            render: (vmLoginUser) => (
                <Tooltip placement="topLeft" title={vmLoginUser}>
                    {vmLoginUser}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: '密码',
            dataIndex: 'vmLoginPassword',
            ellipsis: {
                showTitle: false,
            },
            render: (vmLoginPassword) => (
                <Tooltip placement="topLeft" title={vmLoginPassword}>
                    {vmLoginPassword}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: '镜像版本',
            dataIndex: 'vmSnapVersion',
            ellipsis: {
                showTitle: false,
            },
            render: (vmSnapVersion) => (
                <Tooltip placement="topLeft" title={vmSnapVersion}>
                    {vmSnapVersion}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: '资源优先级',
            dataIndex: 'vmResourcePriority',
            ellipsis: {
                showTitle: false,
            },
            render: (vmResourcePriority) => (
                <Tooltip placement="topLeft" title={vmResourcePriority}>
                    {vmResourcePriority}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: 'XML配置',
            dataIndex: 'vmXmlText',
            ellipsis: {
                showTitle: false,
            },
            render: (vmXmlText) => (
                <Tooltip placement="topLeft" title={vmXmlText}>
                    {vmXmlText}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: 'XML校验',
            dataIndex: 'vmXmlText',
            ellipsis: {
                showTitle: false,
            },
            render: (vmXmlMd5) => (
                <Tooltip placement="topLeft" title={vmXmlMd5}>
                    {vmXmlMd5}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: '权限组ID',
            dataIndex: 'vmAuthorityGroupUuid',
            ellipsis: {
                showTitle: false,
            },
            render: (vmAuthorityGroupUuid) => (
                <Tooltip placement="topLeft" title={vmAuthorityGroupUuid}>
                    {vmAuthorityGroupUuid}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: '自动迁移',
            dataIndex: 'vmAutoAdjust',
            ellipsis: {
                showTitle: false,
            },
            render: (vmAutoAdjust) => (
                <Tooltip placement="topLeft" title={vmAutoAdjust}>
                    {vmAutoAdjust}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: '区域ID',
            dataIndex: 'vmZoneUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmZoneUuid) => (
                <Tooltip placement="topLeft" title={vmZoneUuid}>
                    {vmZoneUuid}
                </Tooltip>
            )
        },
        {
            title: '集群ID',
            dataIndex: 'vmClusterUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmClusterUuid) => (
                <Tooltip placement="topLeft" title={vmClusterUuid}>
                    {vmClusterUuid}
                </Tooltip>
            )
        },
        {
            title: '镜像ID',
            dataIndex: 'vmImageUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmImageUuid) => (
                <Tooltip placement="topLeft" title={vmImageUuid}>
                    {vmImageUuid}
                </Tooltip>
            )
        },
        {
            title: '主机ID',
            dataIndex: 'vmHostUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmHostUuid) => (
                <Tooltip placement="topLeft" title={vmHostUuid}>
                    {vmHostUuid}
                </Tooltip>
            )
        },
        {
            title: '计算规则ID',
            dataIndex: 'vmInstanceOfferingUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmInstanceOfferingUuid) => (
                <Tooltip placement="topLeft" title={vmInstanceOfferingUuid}>
                    {vmInstanceOfferingUuid}
                </Tooltip>
            )
        },
        {
            title: '云盘ID',
            dataIndex: 'vmRootVolumeUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmRootVolumeUuid) => (
                <Tooltip placement="topLeft" title={vmRootVolumeUuid}>
                    {vmRootVolumeUuid}
                </Tooltip>
            )
        },
        {
            title: '三层网络ID',
            dataIndex: 'vmDefaultL3NetworkUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmDefaultL3NetworkUuid) => (
                <Tooltip placement="topLeft" title={vmDefaultL3NetworkUuid}>
                    {vmDefaultL3NetworkUuid}
                </Tooltip>
            )
        },
        {
            title: '主机地址',
            dataIndex: 'vmNicIp',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (vmNicIp) => (
                <Tooltip placement="topLeft" title={vmNicIp}>
                    {vmNicIp}
                </Tooltip>
            )
        },
        {
            title: '内存',
            dataIndex: 'vmMemorySize',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (vmMemorySize) => (
                <Tooltip placement="topLeft" title={vmMemorySize}>
                    {vmMemorySize} Byte
                </Tooltip>
            )
        },
        {
            title: '处理器核数',
            dataIndex: 'vmCpuNum',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (vmCpuNum) => (
                <Tooltip placement="topLeft" title={vmCpuNum}>
                    {vmCpuNum}
                </Tooltip>
            )
        },
        {
            title: '处理器架构',
            dataIndex: 'vmArchitecture',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (vmArchitecture) => (
                <Tooltip placement="topLeft" title={vmArchitecture}>
                    {vmArchitecture}
                </Tooltip>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'vmCreateTime',
            valueType: 'date',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (vmCreateTime) => (
                <Tooltip placement="topLeft" title={vmCreateTime}>
                    {vmCreateTime}
                </Tooltip>
            )
        },
        {
            title: '状态',
            dataIndex: 'vmState',
            ellipsis: {
                showTitle: false,
            },
            width: 100,
        },
        {
            title: '监控',
            dataIndex: 'vmUuid',
            key: 'vmUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
            render: (vmUuid) => (
                    <a onClick={(event) => {console.log(vmUuid.props.children);event.preventDefault();history.push("/monitor?uuid=" + vmUuid.props.children)}}>
                        查看监控
                    </a>
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 155,
            render: (_, record) =>
                <Space>
                    <Button size={"large"} type="dashed" onClick={() => showUpdateModal(record)}>编辑</Button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => deleteHost(record.hostUuid)}>
                        <Button size={"large"} danger={true} type="dashed">删除</Button>
                    </Popconfirm>
                </Space>
        }
    ];

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    let [data, setData] = useState([])
    let [selectData, setSelectData] = useState();
    let [addModalOpen, setAddModalOpen] = useState(false);
    let [updateModalOpen, setUpdateModalOpen] = useState(false);
    let [migrateModalOpen, setMigrateModalOpen] = useState(false);
    let [getDetailOpen, setGetDetailOpen] = useState(false);
    let [addFormInstance] = Form.useForm();
    let [updateFormInstance] = Form.useForm();
    const [apiNotification, contextHolder] = notification.useNotification();
    let [hostList, setHostList] = useState([]);
    let [migrateType, setMigrateType] = useState(1);
    let [recommendHostName, setRecommendHostName] = useState("无");
    let [instanceList, setInstanceList] = useState([]);
    let [diskList, setDiskList] = useState([]);
    let [primaryStorage, setPrimaryStorageList] = useState([]);
    let [threeNetList, setThreeNetList] = useState([]);
    let [mirrorList, setMirrorList] = useState([]);

    // 钩子，启动时获取宿主机列表
    useEffect(() => {
        apiQueryVmList().then(resp => {
            if (resp != null) {
                setData(resp);
            }
        })
    }, [])

    useEffect(() => {
        const random = Math.random().toString(36).slice(-8);
        const websocket_recommend = new WebSocket(
            'ws://' + window.location.hostname + ':28080/api/websocket/resource/' +
            random,
        );
        websocket_recommend.onopen = function () {
          console.log('websocket open');
        };
        websocket_recommend.onmessage = function (msg) {
          console.log('ws://' + window.location.hostname + ':28080/api/websocket/resource/', msg.data);
          message.success('推荐信息变更：节点：' + msg.data);
          apiNotification.warning({
            message: '推荐信息变更：',
            description: '节点：' + msg.data,
            duration: 5,
          });
        };
        websocket_recommend.onclose = function () {
          console.log('websocket closed');
        };
        websocket_recommend.onerror = function () {
          console.log('websocket error');
          // api.error({
          //   message: '报警接口连接失败',
          //   description: '',
          //   duration: 2,
          // });
        };
      }, []);

//       // 每隔5秒打印一次
//   useEffect(() => {
//     const interval = setInterval(() => {
//     apiNotification.info({
//         message: '迁移节点：',
//         description: '节点：9e22c5b6c6534868a14f996f89e6c39e 已迁移',
//         duration: 2,
//       });
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    // 打开详细信息
    const showGetDetailOpen = (Uuid: String) => {
        const res = data.find(item => item.vmUuid == Uuid)
        console.log("showGetDetailOpen", res)
        setSelectData(res);
        setGetDetailOpen(true);
    }
    // 打开新增宿主机窗口
    const showAddModal = () => {
        addFormInstance.resetFields();
        apiRefreshHostList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.hostName,
                            "value": element.hostUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setHostList(transformedData);
            }
        })
        apiQueryInstanceOfferingList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.instanceName,
                            "value": element.instanceUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setInstanceList(transformedData);
            }
        })
        apiQueryDiskOfferingList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.diskOfferingName,
                            "value": element.diskOfferingUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setDiskList(transformedData);
            }
        })
        apiQueryPrimaryStorageList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.psName,
                            "value": element.psUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setPrimaryStorageList(transformedData);
            }
        })
        apiQueryThreeNetworkInfoList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.threeNetworkName,
                            "value": element.threeNetworkUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setThreeNetList(transformedData);
            }
        })
        apiQueryMirrorList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.mirrorName,
                            "value": element.mirrorUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setMirrorList(transformedData);
            }
        })
        setAddModalOpen(true);
    }
    // 打开新增宿主机窗口
    const showMigrateModal = (record: DataType, type: number) => {
        setMigrateType(type)
        apiRefreshHostList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.hostName,
                            "value": element.hostUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setHostList(transformedData);
            }
        })
        apiRefreshHostList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.hostName,
                            "value": element.hostUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setHostList(transformedData);
            }
        })
        apiQueryInstanceOfferingList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.instanceName,
                            "value": element.instanceUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setInstanceList(transformedData);
            }
        })
        apiQueryDiskOfferingList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.diskOfferingName,
                            "value": element.diskOfferingUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setDiskList(transformedData);
            }
        })
        apiQueryPrimaryStorageList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.psName,
                            "value": element.psUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setPrimaryStorageList(transformedData);
            }
        })
        apiQueryThreeNetworkInfoList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.threeNetworkName,
                            "value": element.threeNetworkUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setThreeNetList(transformedData);
            }
        })
        apiQueryMirrorList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.mirrorName,
                            "value": element.mirrorUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setMirrorList(transformedData);
            }
        })
        updateFormInstance.setFieldsValue({
            vmUuid: record.vmUuid,
        });
        // Get recommend
        apiGetRecommendHost().then(resp => {
            if (resp != null) {
                setRecommendHostName(resp);
            }
        })

        setMigrateModalOpen(true);
    }
    // 打开修改宿主机信息窗口
    const showUpdateModal = (record: DataType) => {
        setUpdateModalOpen(true);
        apiRefreshHostList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.hostName,
                            "value": element.hostUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setHostList(transformedData);
            }
        })
        apiRefreshHostList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.hostName,
                            "value": element.hostUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setHostList(transformedData);
            }
        })
        apiQueryInstanceOfferingList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.instanceName,
                            "value": element.instanceUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setInstanceList(transformedData);
            }
        })
        apiQueryDiskOfferingList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.diskOfferingName,
                            "value": element.diskOfferingUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setDiskList(transformedData);
            }
        })
        apiQueryPrimaryStorageList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.psName,
                            "value": element.psUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setPrimaryStorageList(transformedData);
            }
        })
        apiQueryThreeNetworkInfoList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.threeNetworkName,
                            "value": element.threeNetworkUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setThreeNetList(transformedData);
            }
        })
        apiQueryMirrorList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.mirrorName,
                            "value": element.mirrorUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setMirrorList(transformedData);
            }
        })
        updateFormInstance.setFieldsValue({
            vmUuid: record.vmUuid,
            // authorityGroupUuid: record.authorityGroupUuid,
            // autoAdjust: record.autoAdjust,
            // resourcePriority: record.resourcePriority,
            // rootDiskOfferingUuid: record.rootDiskOfferingUuid,
            // dataDiskOfferingUuidList: record.dataDiskOfferingUuidList,
            // defaultL3NetworkUuid: record.defaultL3NetworkUuid,
            // description: record.description,
            // hostUuid: record.hostUuid,
            // imageUuid: record.imageUuid,
            instanceOfferingUuid: record.instanceOfferingUuid,
            // vmPrimaryStorageUuid: record.vmPrimaryStorageUuid,
            // name: record.name,
            // loginUser: record.loginUser,
            // loginPassword: record.loginPassword,
            // vmSetCleanTraffic: record.vmSetCleanTraffic,
            // vmSetRdp: record.vmSetRdp,
            // vmSetUsb: record.vmSetUsb
        });
    }
    // 新增宿主机
    const submitAddModal = () => {
        let tempAddFormInstance = addFormInstance.getFieldsValue()
        tempAddFormInstance.dataDiskOfferingUuidList = [tempAddFormInstance.dataDiskOfferingUuidList];

        // If is ISO, set rootDiskOfferingUuid to null
        if (tempAddFormInstance.isISO == true) {
            tempAddFormInstance.rootDiskOfferingUuid = "";
        }

        apiCreateVM(tempAddFormInstance).then(respCode => {
            // 如果新增成功，刷新列表
            if (respCode == 200) {
                apiQueryVmList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
                setAddModalOpen(false);
            }
        })
    }
    // 迁移虚拟机
    const submitMigrateModal = () => {
        const temp = updateFormInstance.getFieldsValue();
        if (migrateType == 1) {
            apiVmLiveMigrate(temp.vmUuid, temp.hostUuid).then(respCode => {
                // 如果成功，刷新列表
                if (respCode == 200) {
                    apiQueryVmList().then(resp => {
                        if (resp != null) {
                            setData(resp);
                        }
                    })
                    setAddModalOpen(false);
                }
            })
        } else {
            apiVmOfflineMigrate(temp.vmUuid, temp.hostUuid).then(respCode => {
                // 如果成功，刷新列表
                if (respCode == 200) {
                    apiQueryVmList().then(resp => {
                        if (resp != null) {
                            setData(resp);
                        }
                    })
                    setAddModalOpen(false);
                }
            })

        }
    }
    // 修改宿主机信息
    const submitUpdateModal = () => {
        const temp = updateFormInstance.getFieldsValue();
        console.log("temp", temp)
        apiChangeInstanceOffering(temp.vmUuid, temp.instanceOfferingUuid).then(respCode => {
            // 如果修改成功刷新列表
            if (respCode == 200) {
                apiQueryVmList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
        apiUpdateHostSSH(sshData).then(respCode => {
            // 如果修改成功刷新列表
            if (respCode == 200) {
                apiQueryVmList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
    }
    // 关闭详细信息窗口
    const cancelGetDetail = () => {
        setGetDetailOpen(false);
    }
    // 取消新增宿主机
    const cancelAddModal = () => {
        setAddModalOpen(false);
    }
    // 取消迁移宿主机
    const canceMigrateModal = () => {
        setMigrateModalOpen(false);
    }
    // 取消修改宿主机
    const cancelUpdateModal = () => {
        setUpdateModalOpen(false);
    }
    // 删除宿主机
    const deleteHost = (hostId: string) => {
        apiDeleteVm(hostId).then(respCode => {
            // 如果宿主机删除成功，刷新列表
            if (respCode == 200) {
                apiQueryVmList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
    }

    const extendHost = (hostId: string) => {
        apiExtendCPU(hostId).then(respCode => {
            // 如果宿主机删除成功，刷新列表
            if (respCode == 200) {
                apiQueryVmList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })

        apiExtendMem(hostId).then(respCode => {
            // 如果宿主机删除成功，刷新列表
            if (respCode == 200) {
                apiQueryVmList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
    }

    const reduceHost = (hostId: string) => {
        apiReduceCPU(hostId).then(respCode => {
            // 如果宿主机删除成功，刷新列表
            if (respCode == 200) {
                apiQueryVmList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })

        apiReduceMem(hostId).then(respCode => {
            // 如果宿主机删除成功，刷新列表
            if (respCode == 200) {
                apiQueryVmList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
    }

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    return (
        <PageContainer>
            {contextHolder}
            <Drawer
                title="新增虚拟机"
                width={720}
                open={addModalOpen}
                onClose={cancelAddModal}
                destroyOnClose={true}
                styles={{
                    body: {
                      paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                      <Button onClick={cancelAddModal}>取消</Button>
                      <Button onClick={submitAddModal} type="primary">
                        确认
                      </Button>
                    </Space>
                  }
            >
                <Form
                    layout="vertical"
                    form={addFormInstance}
                >
                    <Form.Item
                        label="权限组 UUID"
                        name="authorityGroupUuid"
                        rules={[{ required: false, message: '请输入权限组UUID' }]}
                    >
                        <Input placeholder={"xxxxxxxxxxx"} value={"xxxxxxxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="自动调整"
                        name="autoAdjust"
                    >
                        <Radio.Group>
                            <Radio value={true}> 是 </Radio>
                            <Radio value={false}> 否 </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="优先级"
                        name="resourcePriority"
                    >
                        <Radio.Group>
                            <Radio value={0}> 正常 </Radio>
                            <Radio value={1}> 高 </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="是否为ISO"
                        name="isISO"
                    >
                        <Radio.Group>
                            <Radio value={true}> 是 </Radio>
                            <Radio value={false}> 否 </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="系统盘规格列表"
                        name="rootDiskOfferingUuid"
                        rules={[{ required: true, message: '请输入数据盘规格列表!' }]}
                    >
                        <Select
                            options={diskList} />
                        {/* <Input placeholder={"长度不超过 32 个字符"}/> */}
                    </Form.Item>
                    <Form.Item
                        label="数据盘规格列表"
                        name="dataDiskOfferingUuidList"
                    >
                        <Select
                            options={diskList} />
                        {/* <Input placeholder={"长度不超过 32 个字符"}/> */}
                    </Form.Item>
                    <Form.Item
                        label="三层网络UUID"
                        name="defaultL3NetworkUuid"
                        rules={[{ required: true, message: '请输入三层网络UUID!' }]}
                    >
                        <Select
                            options={threeNetList} />
                    </Form.Item>
                    <Form.Item
                        label="虚拟机描述信息"
                        name="description"
                        rules={[{ required: false, message: '请输入描述信息!' }]}
                    >
                        <Input placeholder={"xxxxxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="物理机 UUID"
                        name="hostUuid"
                        rules={[{ required: true, message: '请输入物理机 UUID!' }]}
                    >
                        <Select
                            options={hostList} />
                    </Form.Item>
                    <Form.Item
                        label="虚拟机镜像 UUID"
                        name="imageUuid"
                        rules={[{ required: true, message: '请输入虚拟机镜像 UUID!' }]}
                    >
                        <Select
                            options={mirrorList} />
                    </Form.Item>
                    <Form.Item
                        label="计算规格 UUID"
                        name="instanceOfferingUuid"
                        rules={[{ required: true, message: '请输入计算规格 UUID!' }]}
                    >
                        <Select
                            options={instanceList} />
                    </Form.Item>
                    <Form.Item
                        label="磁盘所属主存储"
                        name="vmPrimaryStorageUuid"
                        rules={[{ required: true, message: '请输入磁盘所属主存储 UUID!' }]}
                    >
                        <Select
                            options={primaryStorage} />
                    </Form.Item>

                    <Form.Item
                        label="虚拟机名称"
                        name="name"
                        rules={[{ required: true, message: '请输入虚拟机名称!' }]}
                    >
                        <Input placeholder={"示例: 22"}/>
                    </Form.Item>
                    <Form.Item
                        label="登录用户"
                        name="loginUser"
                        rules={[{ required: true, message: '请输入登录用户!' }]}
                    >
                        <Input placeholder={"示例: root"}/>
                    </Form.Item>

                    <Form.Item
                        label="登录密码"
                        name="loginPassword"
                        rules={[{ required: true, message: '请输入登录密码!' }]}
                    >
                        <Input.Password placeholder={"示例: 1234"}/>
                    </Form.Item>

                    <Form.Item
                        label="开启防欺诈模式"
                        name="vmSetCleanTraffic"
                    >
                        <Radio.Group>
                            <Radio value={true}> 是 </Radio>
                            <Radio value={false}> 否 </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="开启 RDP 模式"
                        name="vmSetRdp"
                    >
                        <Radio.Group>
                            <Radio value={true}> 是 </Radio>
                            <Radio value={false}> 否 </Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="开启 USB 重定向"
                        name="vmSetUsb"
                    >
                        <Radio.Group>
                            <Radio value={true}> 是 </Radio>
                            <Radio value={false}> 否 </Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer
                title="虚拟机信息修改"
                open={updateModalOpen}
                onClose={cancelUpdateModal}
                width={720}
                styles={{
                    body: {
                      paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                      <Button onClick={cancelUpdateModal}>取消</Button>
                      <Button onClick={submitUpdateModal} type="primary">
                        确认
                      </Button>
                    </Space>
                  }
            >
                <Form
                    form={updateFormInstance}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Form.Item
                        label="虚拟机 UUID"
                        name="vmUuid"
                        rules={[{ required: false, message: '请输入权限组UUID' }]}
                    >
                        <Input disabled placeholder={"xxxxxxxxxxx"} value={"xxxxxxxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="计算规格 UUID"
                        name="instanceOfferingUuid"
                        rules={[{ required: true, message: '请输入计算规格 UUID!' }]}
                    >
                        <Select
                            options={instanceList} />
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer
                title="虚拟机详细信息"
                open={getDetailOpen}
                onClose={cancelGetDetail}
                width={1200}
                styles={{
                    body: {
                      paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                      <Button onClick={cancelGetDetail}>取消</Button>
                    </Space>
                  }
            >
                <ProDescriptions title="基础信息" column={2} layout="vertical" bordered dataSource={selectData} columns={detailColumn} />

                <ProDescriptions
                    style={{
                        "paddingTop": 20
                    }} title="快照" column={2} layout="vertical" />

                <VmSnapshotPage uuid={selectData?.vmUuid}/>
            </Drawer>

            <Drawer
                title="虚拟机迁移"
                open={migrateModalOpen}
                onClose={canceMigrateModal}
                width={720}
                styles={{
                    body: {
                      paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                      <Button onClick={canceMigrateModal}>取消</Button>
                      <Button onClick={submitMigrateModal} type="primary">
                        确认
                      </Button>
                    </Space>
                  }
            >
                <Form
                    form={updateFormInstance}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Form.Item
                        label="虚拟机ID"
                        name="vmUuid"
                        rules={[{ required: true, message: '请输入宿主机ID!' }]}
                    >
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="宿主机ID"
                        name="hostUuid"
                        rules={[{ required: true, message: '请输入宿主机 IP!' }]}
                    >
                        <Select
                            options={hostList} />
                    </Form.Item>
                </Form>
                <Alert
                    message="推荐宿主机"
                    description={recommendHostName}
                    type="success"
                    showIcon
                />
            </Drawer>

            <Space size={"middle"}>
                <Button type="primary"
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => apiQueryVmList().then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    刷新
                </Button>
                <Button type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}>新增虚拟机</Button>
                <Button type="dashed"
                        shape="round"
                        size="large"
                        onClick={() => apiVmStart(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    启动
                </Button>
                <Button type="dashed"
                        shape="round"
                        size="large"
                        onClick={() => apiVmStop(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    停止
                </Button>
                <Button type="dashed"
                        shape="round"
                        size="large"
                        onClick={() => apiVmPause(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    暂停
                </Button>
                <Button type="dashed"
                        shape="round"
                        size="large"
                        style={{
                            marginRight: "300px"
                        }}
                        onClick={() => apiVmResume(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    恢复
                </Button>
                <Button type="dashed"
                    size="large"
                        icon={<PlayCircleOutlined />}
                        onClick={() => apiStartVMMonitor(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                console.log("apiStartVMMonitor", resp.vmErrorMap)
                                if (JSON.stringify(resp.vmErrorMap) != '{}') {
                                    apiNotification.error({
                                        message: '启动监测失败',
                                        description: JSON.stringify(resp.vmErrorMap),
                                        duration: 2,
                                    })
                                }
                                if (JSON.stringify(resp.vmSuccessfulMap) != '{}') {
                                    apiNotification.info({
                                        message: '启动监测成功',
                                        description: JSON.stringify(resp.vmSuccessfulMap),
                                        duration: 5,
                                    })
                                }
                                // setData(resp);
                            }})}>
                    启动监测
                </Button>
                <Button type="dashed"
                        size="large"
                        icon={<PauseCircleOutlined />}
                        onClick={() => apiStopVMMonitor(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                console.log("apiStopVMMonitor", resp.vmErrorMap)
                                if (JSON.stringify(resp.vmErrorMap) != '{}') {
                                    apiNotification.error({
                                        message: '停止监测失败',
                                        description: JSON.stringify(resp.vmErrorMap),
                                        duration: 2,
                                    })
                                }
                                if (JSON.stringify(resp.vmSuccessfulMap) != '{}') {
                                    apiNotification.info({
                                        message: '停止监测成功',
                                        description: JSON.stringify(resp.vmSuccessfulMap),
                                        duration: 5,
                                    })
                                }
                                // setData(resp);
                            }})}>
                    停止监测
                </Button>
            </Space>
            <Table style={{marginTop: 15}}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
                    rowKey={"vmUuid"}
                    scroll={{x: 1000}}>
            </Table>
        </PageContainer>
    );
};
export default VmManagePage;