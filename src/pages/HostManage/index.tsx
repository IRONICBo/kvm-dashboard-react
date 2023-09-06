import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form, Input, Modal, Popconfirm, Space, Table, Tooltip} from "antd";
import {ColumnsType} from "antd/es/table";
import {apiAddHost, apiDeleteHost, apiRefreshHostList, apiUpdateHost} from "@/api/HostManage";
import { history } from 'umi';

interface DataType {
    hostZzid: number,
    hostId: string,
    hostName: string,
    hostDescription: string,
    hostIp: string,
    hostPort: string,
    hostPortSsh: string,
    hostLoginUsername: string,
    hostLoginPassword: string,
    hostEnable: number,
    hostCreateTime: unknown
}

const HostManagePage: React.FC = () => {

    const columns: ColumnsType<DataType> = [
        {
            title: 'UUID',
            dataIndex: 'hostId',
            ellipsis: {
                showTitle: false,
            },
            width: 110,
            fixed: "left",
            render: (hostId) => (
                <Tooltip placement="topLeft" title={hostId}>
                    <a onClick={(event) => {event.preventDefault();history.push("/monitor?uuid=" + hostId)}}>
                        {hostId}
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
            title: 'Qemu端口',
            dataIndex: 'hostPort',
            ellipsis: {
                showTitle: false,
            },
            render: (hostPort) => (
                <Tooltip placement="topLeft" title={hostPort}>
                    {hostPort}
                </Tooltip>
            )
        },
        {
            title: 'SSH端口',
            dataIndex: 'hostPortSsh',
            ellipsis: {
                showTitle: false,
            },
            render: (hostPortSsh) => (
                <Tooltip placement="topLeft" title={hostPortSsh}>
                    {hostPortSsh}
                </Tooltip>
            )
        },
        {
            title: '登录用户',
            dataIndex: 'hostLoginUsername',
            ellipsis: {
                showTitle: false,
            },
            render: (hostLoginUsername) => (
                <Tooltip placement="topLeft" title={hostLoginUsername}>
                    {hostLoginUsername}
                </Tooltip>
            )
        },
        // {
        //     title: '登录密码',
        //     dataIndex: 'hostLoginPassword',
        //     ellipsis: {
        //         showTitle: false,
        //     },
        //     render: (hostLoginPassword) => (
        //         <Tooltip placement="topLeft" title={hostLoginPassword}>
        //             {hostLoginPassword}
        //         </Tooltip>
        //     )
        // },
        {
            title: '描述信息',
            dataIndex: 'hostDescription',
            ellipsis: {
                showTitle: false,
            },
            render: (hostDescription) => (
                <Tooltip placement="topLeft" title={hostDescription}>
                    {hostDescription}
                </Tooltip>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'hostCreateTime',
            ellipsis: {
                showTitle: false,
            },
            render: (hostCreateTime) => (
                <Tooltip placement="topLeft" title={hostCreateTime}>
                    {hostCreateTime}
                </Tooltip>
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
                    <Popconfirm title="Sure to delete?" onConfirm={() => deleteHost(record.hostId)}>
                        <Button size={"small"} shape={"round"} danger={true} type="dashed">删除</Button>
                    </Popconfirm>
                </Space>
        }
    ];

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    let [data, setData] = useState([])
    let [addModalOpen, setAddModalOpen] = useState(false);
    let [updateModalOpen, setUpdateModalOpen] = useState(false);
    let [addFormInstance] = Form.useForm();
    let [updateFormInstance] = Form.useForm();

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
    // 打开新增宿主机窗口
    const showAddModal = () => {
        addFormInstance.resetFields();
        setAddModalOpen(true);
    }
    // 打开修改宿主机信息窗口
    const showUpdateModal = (record: DataType) => {
        setUpdateModalOpen(true);
        updateFormInstance.setFieldsValue({
            hostId: record.hostId,
            hostName: record.hostName,
            hostDescription: record.hostDescription,
            hostIp: record.hostIp,
            hostPort: record.hostPort,
            hostPortSsh: record.hostPortSsh,
            hostLoginUsername: record.hostLoginUsername,
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
        apiUpdateHost(updateFormInstance.getFieldsValue()).then(respCode => {
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

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    return (
        <PageContainer>
            <Modal
                title="新增宿主机"
                open={addModalOpen}
                onOk={submitAddModal}
                onCancel={cancelAddModal}
                destroyOnClose={true}
            >
                <Form
                    form={addFormInstance}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 14 }}
                >
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
                        label="QEMU-端口"
                        name="hostPort"
                        rules={[{ required: true, message: '请输入 QEMU 端口!' }]}
                    >
                        <Input placeholder={"示例: 16509"}/>
                    </Form.Item>
                    <Form.Item
                        label="SSH-端口"
                        name="hostPortSsh"
                        rules={[{ required: true, message: '请输入 SSH 端口!' }]}
                    >
                        <Input placeholder={"示例: 22"}/>
                    </Form.Item>
                    <Form.Item
                        label="登录用户"
                        name="hostLoginUsername"
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
            </Modal>

            <Modal
                title="宿主机信息修改"
                open={updateModalOpen}
                onOk={submitUpdateModal}
                onCancel={cancelUpdateModal}
            >
                <Form
                    form={updateFormInstance}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Form.Item
                        label="宿主机ID"
                        name="hostId"
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
                        label="QEMU-端口"
                        name="hostPort"
                        rules={[{ required: true, message: '请输入 QEMU 端口!' }]}
                    >
                        <Input placeholder={"示例: 16509"}/>
                    </Form.Item>
                    <Form.Item
                        label="SSH-端口"
                        name="hostPortSsh"
                        rules={[{ required: true, message: '请输入 SSH 端口!' }]}
                    >
                        <Input placeholder={"示例: 22"}/>
                    </Form.Item>
                    <Form.Item
                        label="登录用户"
                        name="hostLoginUsername"
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
            </Modal>

            <Space size={"middle"}>
                <Button shape={"round"} type="primary" onClick={showAddModal}>新增</Button>
                <Button shape={"round"} type="dashed"
                        onClick={() => apiRefreshHostList().then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    刷新
                </Button>
            </Space>
            <Table style={{marginTop: 6}} columns={columns} dataSource={data} rowKey={"hostId"} scroll={{x: 1000}}></Table>
        </PageContainer>
    );
};
export default HostManagePage;