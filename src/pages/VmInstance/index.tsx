import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form, Drawer, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag, Radio, Slider} from "antd";
import {ColumnsType} from "antd/es/table";
import {apiQueryInstanceOfferingList, apiInstanceOfferingDelete, apiInstanceOfferingCreate} from "@/api/VmInstance";
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
            dataIndex: 'instanceZzid',
            ellipsis: {
                showTitle: false,
            },
            width: 50,
            fixed: "left",
        },
        {
            title: 'UUID',
            dataIndex: 'instanceUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
        },
        {
            title: '计算规格名称',
            dataIndex: 'instanceName',
            ellipsis: {
                showTitle: false,
            },
            render: (instanceName) => (
                <Tooltip placement="topLeft" title={instanceName}>
                    {instanceName}
                </Tooltip>
            ),
            width: 130
        },
        {
            title: '处理器数目',
            dataIndex: 'instanceVirtualCpuNum',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (instanceVirtualCpuNum) => (
                <Tooltip placement="topLeft" title={instanceVirtualCpuNum}>
                    {instanceVirtualCpuNum ? instanceVirtualCpuNum : "无"}
                </Tooltip>
            )
        },
        {
            title: '内存大小',
            dataIndex: 'instanceMemorySize',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (instanceMemorySize) => (
                <Tooltip placement="topLeft" title={instanceMemorySize}>
                    {instanceMemorySize/1024/1024/1024} GB
                </Tooltip>
            )
        },
        {
            title: '计算规格系统',
            dataIndex: 'mirrorGuestOsType',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (mirrorGuestOsType) => (
                <Tooltip placement="topLeft" title={mirrorGuestOsType}>
                    {mirrorGuestOsType == null ? "无" : mirrorGuestOsType}
                </Tooltip>
            )
        },
        {
            title: '物理机选择策略',
            dataIndex: 'instanceAllocatorStrategy',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (instanceAllocatorStrategy) => (
                <Tooltip placement="topLeft" title={instanceAllocatorStrategy}>
                    {instanceAllocatorStrategy}
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

    // 钩子，启动时获取计算规格列表
    useEffect(() => {
        apiQueryInstanceOfferingList().then(resp => {
            if (resp != null) {
                setData(resp);
            }
        })
    }, [])

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    // 打开新增计算规格窗口
    const showAddModal = () => {
        addFormInstance.resetFields();
        setAddModalOpen(true);
    }
    // 打开修改计算规格信息窗口
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
    // 新增计算规格
    const submitAddModal = () => {
        apiInstanceOfferingCreate(addFormInstance.getFieldsValue()).then(respCode => {
            // 如果新增成功，刷新列表
            if (respCode == 200) {
                apiQueryInstanceOfferingList().then(resp => {
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
    // 取消新增计算规格
    const cancelAddModal = () => {
        setAddModalOpen(false);
    }
    // 取消修改计算规格
    const cancelUpdateModal = () => {
        setUpdateModalOpen(false);
    }
    // 删除计算规格
    const deleteHost = (hostId: string) => {
        apiInstanceOfferingDelete(hostId).then(respCode => {
            // 如果计算规格删除成功，刷新列表
            if (respCode == 200) {
                apiQueryInstanceOfferingList().then(resp => {
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
                title="新增计算规格"
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
                        label="计算规格名称"
                        name="instanceName"
                        rules={[{ required: true, message: '请输入计算规格名称' }]}
                    >
                        <Input placeholder={"test"}/>
                    </Form.Item>
                    <Form.Item
                        label="处理器数量"
                        name="instanceVirtualCpuNum"
                        rules={[{ required: true, message: '请输入处理器数量' }]}
                    >
                        <Input placeholder={"8"}/>
                    </Form.Item>
                    <Form.Item
                        label="内存大小"
                        name="instanceMemorySize"
                        rules={[{ required: true, message: '请输入内存大小 Byte' }]}
                    >
                        <Input placeholder={"8589934592"}/>
                    </Form.Item>
                    <Form.Item
                        label="物理机选择策略"
                        name="instanceAllocatorStrategy"
                        rules={[{ required: true, message: '请输入物理机选择策略' }]}
                    >
                        <Input placeholder={"LastHostPreferredAllocatorStrategy"}/>
                    </Form.Item>
                </Form>
            </Drawer>

            <Space size={"middle"}>
                <Button type="primary"
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => apiQueryInstanceOfferingList().then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    刷新
                </Button>
                <Button type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}>新增计算规格</Button>
            </Space>
            <Table style={{marginTop: 15}} 
                    rowSelection={rowSelection}
                    columns={columns} 
                    dataSource={data}
                    rowKey={"instanceZzid"}
                    scroll={{x: 1000}}>
            </Table>
        </PageContainer>
    );
};
export default VmNetworkPage;