import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Radio, Form, Drawer, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {apiQueryThreeNetworkInfoList, apiThreeNetworkDelete,apiThreeNetworkCreate} from "@/api/VmNetwork";
import { history } from 'umi';
import { RedoOutlined, PlusOutlined, PlayCircleOutlined, PauseCircleOutlined, PicRightOutlined, PicLeftOutlined } from '@ant-design/icons';

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

const VmNetworkPage: React.FC = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'threeNetworkZzid',
            ellipsis: {
                showTitle: false,
            },
            width: 50,
            fixed: "left",
        },
        {
            title: 'UUID',
            dataIndex: 'threeNetworkUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
        },
        {
            title: '网络名称',
            dataIndex: 'threeNetworkName',
            ellipsis: {
                showTitle: false,
            },
            render: (threeNetworkName) => (
                <Tooltip placement="topLeft" title={threeNetworkName}>
                    {threeNetworkName}
                </Tooltip>
            ),
            width: 130
        },
        {
            title: '网络描述信息',
            dataIndex: 'threeNetworkDescription',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (threeNetworkDescription) => (
                <Tooltip placement="topLeft" title={threeNetworkDescription}>
                    {threeNetworkDescription}
                </Tooltip>
            )
        },
        {
            title: '网络类型',
            dataIndex: 'threeNetworkType',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (threeNetworkType) => (
                <Tooltip placement="topLeft" title={threeNetworkType}>
                    {threeNetworkType}
                </Tooltip>
            )
        },
        {
            title: '二层网络ID',
            dataIndex: 'threeNetworkL2NetworkUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (threeNetworkL2NetworkUuid) => (
                <Tooltip placement="topLeft" title={threeNetworkL2NetworkUuid}>
                    {threeNetworkL2NetworkUuid == null ? "无" : threeNetworkL2NetworkUuid}
                </Tooltip>
            )
        },
        {
            title: '网络分类',
            dataIndex: 'threeNetworkCategory',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (threeNetworkCategory) => (
                <Tooltip placement="topLeft" title={threeNetworkCategory}>
                    {threeNetworkCategory}
                </Tooltip>
            )
        },
        {
            title: '网络协议版本',
            dataIndex: 'threeNetworkIpVersion',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (threeNetworkIpVersion) => (
                <Tooltip placement="topLeft" title={threeNetworkIpVersion}>
                    IPV{threeNetworkIpVersion}
                </Tooltip>
            )
        },
        {
            title: '系统',
            dataIndex: 'threeNetworkSystem',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (threeNetworkSystem) => (
                <Tooltip placement="topLeft" title={threeNetworkSystem}>
                    {threeNetworkSystem}
                </Tooltip>
            )
        },
        {
            title: 'DHCP服务IP',
            dataIndex: 'threeNetworkDhcpServerIp',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (threeNetworkDhcpServerIp) => (
                <Tooltip placement="topLeft" title={threeNetworkDhcpServerIp}>
                    {threeNetworkDhcpServerIp}
                </Tooltip>
            )
        },
        {
            title: 'DNS服务IP',
            dataIndex: 'threeNetworkDnsIp',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (threeNetworkDnsIp) => (
                <Tooltip placement="topLeft" title={threeNetworkDnsIp}>
                    {threeNetworkDnsIp}
                </Tooltip>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'threeNetworkCreateTime',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (threeNetworkCreateTime) => (
                <Tooltip placement="topLeft" title={threeNetworkCreateTime}>
                    {threeNetworkCreateTime}
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
                    {/* <Button size={"small"} shape={"round"} type="dashed" onClick={() => showUpdateModal(record)}>编辑</Button> */}
                    <Popconfirm title="Sure to delete?" onConfirm={() => deleteHost(record.hostUuid)}>
                        <Button size={"small"} shape={"round"} danger={true} type="dashed">删除</Button>
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

    // 钩子，启动时获取三层网络列表
    useEffect(() => {
        apiQueryThreeNetworkInfoList().then(resp => {
            if (resp != null) {
                setData(resp);
            }
        })
    }, [])

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    // 打开新增三层网络窗口
    const showAddModal = () => {
        addFormInstance.resetFields();
        setAddModalOpen(true);
    }
    // 打开修改三层网络信息窗口
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
    // 新增三层网络
    const submitAddModal = () => {
        apiThreeNetworkCreate(addFormInstance.getFieldsValue()).then(respCode => {
            // 如果新增成功，刷新列表
            if (respCode == 200) {
                apiQueryThreeNetworkInfoList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
                setAddModalOpen(false);
            }
        })
    }
    // 关闭详细信息窗口
    const cancelGetDetail = () => {
        setGetDetailOpen(false);
    }
    // 取消新增三层网络
    const cancelAddModal = () => {
        setAddModalOpen(false);
    }
    // 取消修改三层网络
    const cancelUpdateModal = () => {
        setUpdateModalOpen(false);
    }
    // 删除三层网络
    const deleteHost = (hostId: string) => {
        apiThreeNetworkDelete(hostId).then(respCode => {
            // 如果三层网络删除成功，刷新列表
            if (respCode == 200) {
                apiQueryThreeNetworkInfoList().then(resp => {
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
                title="新增三层网络"
                width={720}
                open={addModalOpen}
                onClose={cancelAddModal}
                destroyOnClose={true}
                bodyStyle={{
                      "paddingBottom": 80,
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
                        label="开始IP"
                        name="segmentStartIp"
                        rules={[{ required: true, message: '请输入IP' }]}
                    >
                        <Input placeholder={"xxx.xxx.xxx.xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="结束IP"
                        name="segmentEndIp"
                        rules={[{ required: true, message: '请输入IP' }]}
                    >
                        <Input placeholder={"xxx.xxx.xxx.xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="网关"
                        name="segmentGateway"
                        rules={[{ required: true, message: '请输入IP' }]}
                    >
                        <Input placeholder={"xxx.xxx.xxx.xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="子网掩码"
                        name="segmentNetmask"
                        rules={[{ required: true, message: '请输入IP' }]}
                    >
                        <Input placeholder={"xxx.xxx.xxx.xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="三层网络名称"
                        name="threeNetworkName"
                        rules={[{ required: true, message: '请输入三层网络名称!' }]}
                    >
                        <Input placeholder={"长度不超过 32 个字符"}/>
                    </Form.Item>

                    <Form.Item
                        label="三层网络DNS"
                        name="threeNetworkDnsIp"
                        rules={[{ required: true, message: '请输入三层网络 IP!' }]}
                    >
                        <Input placeholder={"示例: 192.168.0.1"}/>
                    </Form.Item>

                    <Form.Item
                        label="三层网络DHCP服务"
                        name="threeNetworkDhcpServerIp"
                        rules={[{ required: true, message: '请输入三层网络 DHCP!' }]}
                    >
                        <Input placeholder={"示例: 192.168.0.1"}/>
                    </Form.Item>
                    
                    <Form.Item
                        label="三层网络分类"
                        name="threeNetworkCategory"
                        rules={[{ required: true, message: '请输入三层网络分类!' }]}
                    >
                        <Radio.Group>
                            <Radio value="Public">公有</Radio>
                            <Radio value="Private">私有</Radio>
                            <Radio value="System">系统</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="描述信息"
                        name="threeNetworkDescription"
                    >
                        <Input.TextArea showCount={true} placeholder={"最大长度为 500 个字符"} />
                    </Form.Item>
                </Form>
            </Drawer>

            <Space size={"middle"}>
                <Button type="primary"
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => apiQueryThreeNetworkInfoList().then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    刷新
                </Button>
                <Button type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}>新增三层网络</Button>
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
export default VmNetworkPage;