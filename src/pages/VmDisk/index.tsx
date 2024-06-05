import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form, Drawer, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag, Radio, Slider} from "antd";
import {ColumnsType} from "antd/es/table";
import {apiQueryDiskOfferingList, apiDiskOfferingDelete, apiDiskOfferingCreate} from "@/api/VmDisk";
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
            dataIndex: 'diskOfferingZzid',
            ellipsis: {
                showTitle: false,
            },
            width: 50,
            fixed: "left",
        },
        {
            title: 'UUID',
            dataIndex: 'diskOfferingUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
        },
        {
            title: '云盘规格名称',
            dataIndex: 'diskOfferingName',
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
            title: '云盘大小',
            dataIndex: 'diskOfferingSize',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (diskOfferingSize) => (
                <Tooltip placement="topLeft" title={diskOfferingSize}>
                    {diskOfferingSize/1024/1024/1024} GB
                </Tooltip>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'diskOfferingCreateTime',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (diskOfferingCreateTime) => (
                <Tooltip placement="topLeft" title={diskOfferingCreateTime}>
                    {diskOfferingCreateTime? diskOfferingCreateTime :"无"}
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
                    <Popconfirm title="Sure to delete?" onConfirm={() => deleteHost(record.diskOfferingUuid)}>
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

    // 钩子，启动时获取云盘规格列表
    useEffect(() => {
        apiQueryDiskOfferingList().then(resp => {
            if (resp != null) {
                setData(resp);
            }
        })
    }, [])

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    // 打开新增云盘规格窗口
    const showAddModal = () => {
        addFormInstance.resetFields();
        setAddModalOpen(true);
    }
    // 打开修改云盘规格信息窗口
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
    // 新增云盘规格
    const submitAddModal = () => {
        apiDiskOfferingCreate(addFormInstance.getFieldsValue()).then(respCode => {
            // 如果新增成功，刷新列表
            if (respCode == 200) {
                apiQueryDiskOfferingList().then(resp => {
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
    // 取消新增云盘规格
    const cancelAddModal = () => {
        setAddModalOpen(false);
    }
    // 取消修改云盘规格
    const cancelUpdateModal = () => {
        setUpdateModalOpen(false);
    }
    // 删除云盘规格
    const deleteHost = (hostId: string) => {
        apiDiskOfferingDelete(hostId).then(respCode => {
            // 如果云盘规格删除成功，刷新列表
            if (respCode == 200) {
                apiQueryDiskOfferingList().then(resp => {
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
                title="新增云盘规格"
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
                        label="云盘规格名称"
                        name="diskOfferingName"
                        rules={[{ required: true, message: '请输入云盘规格名称' }]}
                    >
                        <Input placeholder={"test"}/>
                    </Form.Item>
                    <Form.Item
                        label="云盘大小"
                        name="diskOfferingSize"
                        rules={[{ required: true, message: '请输入云盘大小 Byte' }]}
                    >
                        <Input placeholder={"8589934592"}/>
                    </Form.Item>
                </Form>
            </Drawer>

            <Space size={"middle"}>
                <Button type="primary"
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => apiQueryDiskOfferingList().then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    刷新
                </Button>
                <Button type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}>新增云盘规格</Button>
            </Space>
            <Table style={{marginTop: 15}}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
                    rowKey={"diskOfferingZzid"}
                    scroll={{x: 1000}}>
            </Table>
        </PageContainer>
    );
};
export default VmNetworkPage;