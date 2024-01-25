import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form, Drawer, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag, notification} from "antd";
import { ProDescriptions } from '@ant-design/pro-components';
import {ColumnsType} from "antd/es/table";
import {apiAddHost, apiDeleteHost, apiRefreshHostList, apiUpdateHost, apiUpdateHostSSH, apiStartHost, apiStopHost } from "@/api/HostManage";
import {apiStartHostMonitor, apiStopHostMonitor} from "@/api/Monitor";
import { history } from 'umi';
import { RedoOutlined, PlusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

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

const HostManagePage: React.FC = () => {
    useEffect(() => {      
        const random = Math.random().toString(36).slice(-8);
        const websocket_recommend = new WebSocket(
          'ws://' + window.location.hostname + ':28080/websocket/resource/' +
            random,
        );
        websocket_recommend.onopen = function () {
          console.log('websocket open');
        };
        websocket_recommend.onmessage = function (msg) {
          console.log('ws://' + window.location.hostname + ':28080/api/websocket/resource/', msg.data);
          apiNotification.warning({
            message: '推荐信息变更：',
            description: '节点：' + msg.data,
            duration: 2,
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

    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'hostZzid',
            ellipsis: {
                showTitle: false,
            },
            width: 50,
            fixed: "left",
        },
        {
            title: 'UUID',
            dataIndex: 'hostUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
            render: (hostUuid) => (
                <Tooltip placement="topLeft" title={hostUuid}>
                    {/* <a onClick={(event) => {event.preventDefault();history.push("/monitor?uuid=" + hostId)}}> */}
                    <a onClick={(event) =>  {event.preventDefault();showGetDetailOpen(hostUuid)}}>
                        {hostUuid}
                    </a>
                </Tooltip>
            )
        },
        {
            title: '名称',
            dataIndex: 'hostName',
            ellipsis: {
                showTitle: false,
            },
            render: (hostName) => (
                <Tooltip placement="topLeft" title={hostName}>
                    {hostName}
                </Tooltip>
            ),
            width: 130
        },
        {
            title: '区域ID',
            dataIndex: 'hostZoneUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (hostZoneUuid) => (
                <Tooltip placement="topLeft" title={hostZoneUuid}>
                    {hostZoneUuid}
                </Tooltip>
            )
        },
        {
            title: '集群ID',
            dataIndex: 'hostClusterUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (hostClusterUuid) => (
                <Tooltip placement="topLeft" title={hostClusterUuid}>
                    {hostClusterUuid}
                </Tooltip>
            )
        },
        {
            title: '描述信息',
            dataIndex: 'hostDescription',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostDescription) => (
                <Tooltip placement="topLeft" title={hostDescription}>
                    {hostDescription == null ? "无" : hostDescription}
                </Tooltip>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'hostCreateTime',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostCreateTime) => (
                <Tooltip placement="topLeft" title={hostCreateTime}>
                    {hostCreateTime}
                </Tooltip>
            )
        },
        {
            title: '状态',
            dataIndex: 'hostState',
            ellipsis: {
                showTitle: false,
            },
            width: 100,
            render: (hostState) => (
                <>
                    {hostState=="enable" ? (
                        <Tag color="blue" key={hostState}>
                            启用
                        </Tag>
                    ) : (
                        <Tag color="volcano" key={hostState}>
                            禁用
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
                    <Popconfirm title="Sure to delete?" onConfirm={() => deleteHost(record.hostUuid)}>
                        <Button size={"small"} shape={"round"} danger={true} type="dashed">删除</Button>
                    </Popconfirm>
                    <Popconfirm title="Sure to star?" onConfirm={() => startHost(record.hostUuid)}>
                        <Button size={"small"} shape={"round"} danger={true} type="dashed">启用</Button>
                    </Popconfirm>
                    <Popconfirm title="Sure to stop?" onConfirm={() => stopHost(record.hostUuid)}>
                        <Button size={"small"} shape={"round"} danger={true} type="dashed">停用</Button>
                    </Popconfirm>
                </Space>
        }
    ];

    const detailColumn = [
        {
            title: 'ID',
            dataIndex: 'hostZzid',
            ellipsis: {
                showTitle: false,
            },
            width: 50,
            fixed: "left",
        },
        {
            title: 'UUID',
            dataIndex: 'hostUuid',
            key: 'hostUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
            render: (hostUuid) => (
                    <a onClick={(event) => {event.preventDefault();history.push("/monitor?uuid=" + hostUuid)}}>
                        {hostUuid}
                    </a>
            )
        },
        {
            title: '名称',
            dataIndex: 'hostName',
            ellipsis: {
                showTitle: false,
            },
            render: (hostName) => (
                <Tooltip placement="topLeft" title={hostName}>
                    {hostName}
                </Tooltip>
            ),
            width: 130
        },
        {
            title: 'IP地址',
            dataIndex: 'hostIp',
            ellipsis: {
                showTitle: false,
            },
            render: (hostIp) => (
                <Tooltip placement="topLeft" title={hostIp}>
                    {hostIp}
                </Tooltip>
            ),
            width: 140
        },
        {
            title: '区域ID',
            dataIndex: 'hostZoneUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (hostZoneUuid) => (
                <Tooltip placement="topLeft" title={hostZoneUuid}>
                    {hostZoneUuid}
                </Tooltip>
            )
        },
        {
            title: '集群ID',
            dataIndex: 'hostClusterUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (hostClusterUuid) => (
                <Tooltip placement="topLeft" title={hostClusterUuid}>
                    {hostClusterUuid}
                </Tooltip>
            )
        },
        {
            title: '描述信息',
            dataIndex: 'hostDescription',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostDescription) => (
                <Tooltip placement="topLeft" title={hostDescription}>
                    {hostDescription == null ? "无" : hostDescription}
                </Tooltip>
            )
        },
        {
            title: '主机地址',
            dataIndex: 'hostIp',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostIp) => (
                <Tooltip placement="topLeft" title={hostIp}>
                    {hostIp}
                </Tooltip>
            )
        },
        {
            title: '主机内存',
            dataIndex: 'hostTotalMemorySize',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostTotalMemorySize) => (
                <Tooltip placement="topLeft" title={hostTotalMemorySize}>
                    {hostTotalMemorySize} Byte
                </Tooltip>
            )
        },
        {
            title: '处理器核数',
            dataIndex: 'hostTotalCpuNum',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostTotalCpuNum) => (
                <Tooltip placement="topLeft" title={hostTotalCpuNum}>
                    {hostTotalCpuNum}
                </Tooltip>
            )
        },
        {
            title: '处理器架构',
            dataIndex: 'hostArchitecture',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostArchitecture) => (
                <Tooltip placement="topLeft" title={hostArchitecture}>
                    {hostArchitecture}
                </Tooltip>
            )
        },
        {
            title: '登录账号',
            dataIndex: 'hostLoginUser',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostLoginUser) => (
                <Tooltip placement="topLeft" title={hostLoginUser}>
                    {hostLoginUser}
                </Tooltip>
            )
        },
        {
            title: '登录密码',
            dataIndex: 'hostLoginPassword',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostLoginPassword) => (
                <Tooltip placement="topLeft" title={hostLoginPassword}>
                    {hostLoginPassword}
                </Tooltip>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'hostCreateTime',
            valueType: 'date',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostCreateTime) => (
                <Tooltip placement="topLeft" title={hostCreateTime}>
                    {hostCreateTime}
                </Tooltip>
            )
        },
        {
            title: '远程端口',
            dataIndex: 'hostSshPort',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostSshPort) => (
                <Tooltip placement="topLeft" title={hostSshPort}>
                    {hostSshPort}
                </Tooltip>
            )
        },
        {
            title: '智能平台管理接口地址',
            dataIndex: 'hostIpmiAddr',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostIpmiAddr) => (
                <Tooltip placement="topLeft" title={hostIpmiAddr}>
                    {hostIpmiAddr}
                </Tooltip>
            )
        },
        {
            title: '简单网络协议地址',
            dataIndex: 'hostSnmpAddr',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (hostSnmpAddr) => (
                <Tooltip placement="topLeft" title={hostSnmpAddr}>
                    {hostSnmpAddr}
                </Tooltip>
            )
        },
        {
            title: '状态',
            dataIndex: 'hostState',
            ellipsis: {
                showTitle: false,
            },
            width: 100,
            render: (hostState) => (
                <>
                    {hostState="enable" ? (
                            "启用"
                    ) : (
                            "禁用"
                    )}
                </>
            )
        },
        {
            title: '监控',
            dataIndex: 'hostUuid',
            key: 'hostUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
            render: (hostUuid, record) => (
                <a onClick={(event) => {
                    console.log(hostUuid.props.children);
                    event.preventDefault();
                    history.push(`/monitor?uuid=${hostUuid.props.children}&ipmi=${record.hostIpmiAddr}&snmp=${record.hostSnmpAddr}`);
                }}>
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
    const [apiNotification, contextHolder] = notification.useNotification();

    // 钩子，启动时获取宿主机列表
    useEffect(() => {
        apiRefreshHostList().then(resp => {
            if (resp != null) {
                setData(resp);
            }
        })
    }, [])

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    // 打开详细信息
    const showGetDetailOpen = (hostUuid: String) => {
        const res = data.find(item => item.hostUuid == hostUuid)
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
                apiRefreshHostList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
        setAddModalOpen(false);
    }
    // 修改宿主机信息
    const submitUpdateModal = () => {
        const temp = updateFormInstance.getFieldsValue();
        const basicData = {
            "hostUuid": temp.hostUuid,
            "hostName": temp.hostName,
            "hostDescription": temp.hostDescription,
            "hostIpmiAddr": temp.hostIpmiAddr,
            "hostSnmpAddr": temp.hostSnmpAddr,
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
                apiRefreshHostList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
        apiUpdateHostSSH(sshData).then(respCode => {
            // 如果修改成功刷新列表
            if (respCode == 200) {
                apiRefreshHostList().then(resp => {
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
        apiDeleteHost(hostId).then(respCode => {
            // 如果宿主机删除成功，刷新列表
            if (respCode == 200) {
                apiRefreshHostList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
    }
    // 启用宿主机
    const startHost = (hostId: string) => {
        apiStartHost(hostId).then(respCode => {
            if (respCode == 200) {
                apiRefreshHostList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
    }
    // 停用宿主机
    const stopHost = (hostId: string) => {
        apiStopHost(hostId).then(respCode => {
            if (respCode == 200) {
                apiRefreshHostList().then(resp => {
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
                title="新增宿主机"
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
                    <Form.Item
                        label="智能管理平台接口地址"
                        name="hostIpmiAddr"
                    >
                        <Input showCount={true} placeholder={"127.0.0.1:161"} />
                    </Form.Item>
                    <Form.Item
                        label="简单网络协议地址"
                        name="hostSnmpAddr"
                    >
                        <Input showCount={true} placeholder={"127.0.0.1:3344"} />
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
                    <Form.Item
                        label="智能管理平台接口地址"
                        name="hostIpmiAddr"
                    >
                        <Input placeholder={"127.0.0.1:161"} />
                    </Form.Item>
                    <Form.Item
                        label="简单网络协议地址"
                        name="hostSnmpAddr"
                    >
                        <Input placeholder={"127.0.0.1:3344"} />
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer
                title="宿主机详细信息"
                open={getDetailOpen}
                onClose={cancelGetDetail}
                width={720}
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
            </Drawer>

            <Space size={"middle"}>
                <Button type="primary"
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => apiRefreshHostList().then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    刷新
                </Button>
                <Button type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}>新增宿主机</Button>
                <Button type="dashed"
                    size="large"
                        icon={<PlayCircleOutlined />}
                        onClick={() => apiStartHostMonitor(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                console.log("apiStartHostMonitor", resp.hostErrorMap)
                                if (resp.hostErrorMap != null) {
                                    apiNotification.error({
                                        message: '启动监测失败',
                                        description: JSON.stringify(resp.hostErrorMap),
                                        duration: 2,
                                    })
                                }
                                if (resp.hostSuccessfulMap != null) {
                                    apiNotification.info({
                                        message: '启动监测失败',
                                        description: JSON.stringify(resp.hostSuccessfulMap),
                                        duration: 2,
                                    })
                                }
                                // setData(resp);
                            }})}>
                    启动监测
                </Button>
                <Button type="dashed"
                        size="large"
                        icon={<PauseCircleOutlined />}
                        onClick={() => apiStopHostMonitor(selectedRowKeys).then(resp => {
                            if (resp != null) {
                                console.log("apiStopHostMonitor", resp.hostErrorMap)
                                if (resp.hostErrorMap != null) {
                                    apiNotification.error({
                                        message: '启动监测失败',
                                        description: JSON.stringify(resp.hostErrorMap),
                                        duration: 2,
                                    })
                                }
                                if (resp.hostSuccessfulMap != null) {
                                    apiNotification.info({
                                        message: '启动监测失败',
                                        description: JSON.stringify(resp.hostSuccessfulMap),
                                        duration: 2,
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
                    rowKey={"hostUuid"}
                    scroll={{x: 1000}}>
            </Table>
        </PageContainer>
    );
};
export default HostManagePage;