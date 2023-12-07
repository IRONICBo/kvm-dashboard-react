import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form, Drawer, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag} from "antd";
import { ProDescriptions } from '@ant-design/pro-components';
import {ColumnsType} from "antd/es/table";
import {apiAddHost, apiDeleteHost, apiUpdateHost, apiUpdateHostSSH} from "@/api/HostManage";
import {apiQueryVmList, apiDeleteVm} from "@/api/VmManage";
import {apiStartMonitor, apiStopMonitor} from "@/api/Monitor";
import { history } from 'umi';
import { RedoOutlined, PlusOutlined, PlayCircleOutlined, PauseCircleOutlined, PicRightOutlined, PicLeftOutlined } from '@ant-design/icons';
import VmSnapshotPage from "../VmSnapshot";

interface DataType {
    hostZzid: number,
    hostUuid: string,
    hostName: string,
    hostDescription: string,
    hostIp: string,
    hostSshPort: string,
    hostLoginUser: string,
    hostLoginPassword: string,
    hostEnable: number,
    hostCreateTime: unknown
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
            width: 155,
            render: (_, record) =>
                <Space>
                    <Button size={"small"} shape={"round"} type="dashed" onClick={() => showUpdateModal(record)}>编辑</Button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => deleteHost(record.hostUuid)}>
                        <Button size={"small"} shape={"round"} danger={true} type="dashed">删除</Button>
                    </Popconfirm>
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
                    <a onClick={(event) => {event.preventDefault();history.push("/monitor?uuid=" + vmUuid)}}>
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
    let [getDetailOpen, setGetDetailOpen] = useState(false);
    let [addFormInstance] = Form.useForm();
    let [updateFormInstance] = Form.useForm();

    // 钩子，启动时获取宿主机列表
    useEffect(() => {
        apiQueryVmList().then(resp => {
            if (resp != null) {
                setData(resp);
            }
        })
    }, [])

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
        setAddModalOpen(true);
    }
    // 打开修改宿主机信息窗口
    const showUpdateModal = (record: DataType) => {
        setUpdateModalOpen(true);
        updateFormInstance.setFieldsValue({
            hostUuid: record.hostUuid,
            hostName: record.hostName,
            hostDescription: record.hostDescription,
            hostIp: record.hostIp,
            hostSshPort: record.hostSshPort,
            hostLoginUser: record.hostLoginUser,
            hostLoginPassword: record.hostLoginPassword,
        });
    }
    // 新增宿主机
    const submitAddModal = () => {
        apiAddHost(addFormInstance.getFieldsValue()).then(respCode => {
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
    // 修改宿主机信息
    const submitUpdateModal = () => {
        const temp = updateFormInstance.getFieldsValue();
        const basicData = {
            "hostUuid": temp.hostUuid,
            "hostName": temp.hostName,
            "hostDescription": temp.hostDescription,
        }
        const sshData = {
            "hostUuid": temp.hostUuid,
            "password": temp.hostLoginPassword,
            "sshPort": temp.hostSshPort,
            "username": temp.hostLoginUser,
          }

        apiUpdateHost(basicData).then(respCode => {
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
                        label="集群UUID"
                        name="hostClusterUuid"
                        rules={[{ required: true, message: '请输入集群UUID' }]}
                    >
                        <Input placeholder={"xxxxxxxxxxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="宿主机名称"
                        name="hostName"
                        rules={[{ required: true, message: '请输入宿主机名称!' }]}
                    >
                        <Input placeholder={"长度不超过 32 个字符"}/>
                    </Form.Item>

                    <Form.Item
                        label="宿主机IP"
                        name="hostIp"
                        rules={[{ required: true, message: '请输入宿主机 IP!' }]}
                    >
                        <Input placeholder={"示例: 192.168.0.1"}/>
                    </Form.Item>

                    <Form.Item
                        label="SSH-端口"
                        name="hostSshPort"
                        rules={[{ required: true, message: '请输入 SSH 端口!' }]}
                    >
                        <Input placeholder={"示例: 22"}/>
                    </Form.Item>
                    <Form.Item
                        label="登录用户"
                        name="hostLoginUser"
                        rules={[{ required: true, message: '请输入登录用户!' }]}
                    >
                        <Input placeholder={"示例: root"}/>
                    </Form.Item>

                    <Form.Item
                        label="登录密码"
                        name="hostLoginPassword"
                        rules={[{ required: true, message: '请输入登录密码!' }]}
                    >
                        <Input.Password placeholder={"示例: 1234"}/>
                    </Form.Item>

                    <Form.Item
                        label="描述信息"
                        name="hostDescription"
                    >
                        <Input.TextArea showCount={true} placeholder={"最大长度为 500 个字符"} />
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer
                title="宿主机信息修改"
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
                        label="宿主机ID"
                        name="hostUuid"
                        rules={[{ required: true, message: '请输入宿主机ID!' }]}
                    >
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="宿主机名称"
                        name="hostName"
                        rules={[{ required: true, message: '请输入宿主机名称!' }]}
                    >
                        <Input placeholder={"长度不超过 32 个字符"}/>
                    </Form.Item>

                    <Form.Item
                        label="宿主机IP"
                        name="hostIp"
                        rules={[{ required: true, message: '请输入宿主机 IP!' }]}
                    >
                        <Input placeholder={"示例: 192.168.0.1"}/>
                    </Form.Item>
                    <Form.Item
                        label="SSH-端口"
                        name="hostSshPort"
                        rules={[{ required: true, message: '请输入 SSH 端口!' }]}
                    >
                        <Input placeholder={"示例: 22"}/>
                    </Form.Item>
                    <Form.Item
                        label="登录用户"
                        name="hostLoginUser"
                        rules={[{ required: true, message: '请输入登录用户!' }]}
                    >
                        <Input placeholder={"示例: root"}/>
                    </Form.Item>
                    <Form.Item
                        label="登录密码"
                        name="hostLoginPassword"
                        rules={[{ required: true, message: '请输入登录密码!' }]}
                    >
                        <Input.Password placeholder={"示例: 1234"}/>
                    </Form.Item>
                    <Form.Item
                        label="描述信息"
                        name="hostDescription"
                    >
                        <Input.TextArea showCount={true} placeholder={"最大长度为 500 个字符"} />
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
                    size="large"
                        icon={<PlayCircleOutlined />}
                        onClick={() => apiStartMonitor(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    启动监测
                </Button>
                <Button type="dashed"
                        size="large"
                        icon={<PauseCircleOutlined />}
                        onClick={() => apiStopMonitor(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    停止监测
                </Button>
                <Button type="dashed"
                        danger
                        size="large"
                        icon={<PicRightOutlined />}
                        onClick={() => apiStopMonitor(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    虚拟机热迁移
                </Button>
                <Button type="dashed"
                        danger
                        size="large"
                        icon={<PicLeftOutlined />}
                        onClick={() => apiStopMonitor(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    虚拟机冷迁移
                </Button>
            </Space>
            <Table style={{marginTop: 15}} 
                    rowSelection={rowSelection}
                    columns={columns} 
                    dataSource={data}
                    rowKey={"hostUuid"}
                    scroll={{x: 1000}}>
            </Table>
        </PageContainer>
    );
};
export default VmManagePage;