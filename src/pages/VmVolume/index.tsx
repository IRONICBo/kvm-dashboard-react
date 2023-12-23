import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form, Drawer, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag, Radio, Slider, Select} from "antd";
import {ColumnsType} from "antd/es/table";
import {apiQueryVolumeList, apiVolumeDelete, apiVolumeCreate, apiVolumeExpand} from "@/api/VmVolume";
import { history } from 'umi';
import { RedoOutlined, PlusOutlined, PlayCircleOutlined, PauseCircleOutlined, PicRightOutlined, PicLeftOutlined } from '@ant-design/icons';
import { apiQueryVmList } from '@/api/VmManage';

interface DataType {
    volumeUuid: string,
    volumeSize: number,
}

const VmVolumePage: React.FC = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'volumeZzid',
            ellipsis: {
                showTitle: false,
            },
            width: 50,
            fixed: "left",
        },
        {
            title: 'UUID',
            dataIndex: 'volumeUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
        },
        {
            title: '数据盘名称',
            dataIndex: 'volumeName',
            ellipsis: {
                showTitle: false,
            },
            render: (volumeName) => (
                <Tooltip placement="topLeft" title={volumeName}>
                    {volumeName}
                </Tooltip>
            ),
            width: 130
        },
        {
            title: '云盘信息描述',
            dataIndex: 'volumeDescription',
            ellipsis: {
                showTitle: false,
            },
            render: (volumeDescription) => (
                <Tooltip placement="topLeft" title={volumeDescription}>
                    {volumeDescription}
                </Tooltip>
            ),
            width: 300
        },
        {
            title: '计算规格ID',
            dataIndex: 'volumeDiskOfferingUuid',
            ellipsis: {
                showTitle: false,
            },
            render: (volumeDiskOfferingUuid) => (
                <Tooltip placement="topLeft" title={volumeDiskOfferingUuid}>
                    {volumeDiskOfferingUuid}
                </Tooltip>
            ),
            width: 300
        },
        {
            title: '云盘大小',
            dataIndex: 'volumeSize',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (volumeSize) => (
                <Tooltip placement="topLeft" title={volumeSize}>
                    {volumeSize/1024/1024/1024} GB
                </Tooltip>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'volumeCreateTime',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (volumeCreateTime) => (
                <Tooltip placement="topLeft" title={volumeCreateTime}>
                    {volumeCreateTime? volumeCreateTime :"无"}
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
                    <Button size={"small"} shape={"round"} type="dashed" onClick={() => showUpdateModal(record)}>扩容</Button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => deleteHost(record.volumeUuid)}>
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
    let [vmList, setVmList] = useState([]);

    // 钩子，启动时获取数据盘列表
    useEffect(() => {
        apiQueryVolumeList().then(resp => {
            if (resp != null) {
                setData(resp);
            }
        })
    }, [])

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    // 打开新增数据盘窗口
    const showAddModal = () => {
        addFormInstance.resetFields();
        apiQueryVmList().then(resp => {
            if (resp != null) {
                const transformedData = [];
                resp.forEach(element => {
                console.log("transformedData", element)
                    transformedData.push(
                        {
                            "label": element.vmName,
                            "value": element.vmUuid,
                        }
                    )
                });
                // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                console.log("transformedData", transformedData)
                setVmList(transformedData);
            }
        })
        console.log("setVmList", vmList);
        setAddModalOpen(true);
    }
    // 打开修改数据盘信息窗口
    const showUpdateModal = (record: DataType) => {
        setUpdateModalOpen(true);
        updateFormInstance.setFieldsValue({
            volumeUuid: record.volumeUuid,
            size: record.volumeSize
        });
    }
    // 新增数据盘
    const submitAddModal = () => {
        apiVolumeCreate(addFormInstance.getFieldsValue()).then(respCode => {
            // 如果新增成功，刷新列表
            if (respCode == 200) {
                apiQueryVolumeList().then(resp => {
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
    // 取消新增数据盘
    const cancelAddModal = () => {
        setAddModalOpen(false);
    }
    // 取消修改数据盘
    const cancelUpdateModal = () => {
        setUpdateModalOpen(false);
    }
    // 扩容数据盘
    const submitUpdateModal = () => {
        const temp = updateFormInstance.getFieldsValue();
        apiVolumeExpand(temp.volumeUuid, temp.size).then(respCode => {
            // 如果数据盘扩容成功，刷新列表
            if (respCode == 200) {
                apiQueryVolumeList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
    }

    // 删除数据盘
    const deleteHost = (hostId: string) => {
        apiVolumeDelete(hostId).then(respCode => {
            // 如果数据盘删除成功，刷新列表
            if (respCode == 200) {
                apiQueryVolumeList().then(resp => {
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
                title="新增数据盘"
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
                        label="数据盘名称"
                        name="volumeName"
                        rules={[{ required: true, message: '请输入数据盘名称' }]}
                    >
                        <Input placeholder={"test"}/>
                    </Form.Item>
                    
                    <Form.Item
                        label="云盘规格ID"
                        name="volumeDiskOfferingUuid"
                        rules={[{ required: true, message: '请输入云盘规格ID' }]}
                    >
                        <Input placeholder={"42ad89dc78ab42ad8b4929c45a2fa6ec"}/>
                    </Form.Item>

                    <Form.Item
                        label="虚拟机ID"
                        name="volumeVmInstanceUuid"
                        rules={[{ required: true, message: '请输虚拟机ID' }]}
                    >
                        <Select 
                            options={vmList} />
                        {/* <Input placeholder={"42ad89dc78ab42ad8b4929c45a2fa6ec"}/> */}
                    </Form.Item>

                    <Form.Item
                        label="描述信息"
                        name="volumeDescription"
                    >
                        <Input.TextArea showCount={true} placeholder={"最大长度为 500 个字符"} />
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer
                title="扩容"
                open={updateModalOpen}
                onClose={cancelUpdateModal}
                width={720}
                bodyStyle={{
                    paddingBottom: 80,
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
                        label="数据盘ID"
                        name="volumeUuid"
                        rules={[{ required: true, message: '请输入宿主机ID!' }]}
                    >
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="数据盘大小"
                        name="size"
                        rules={[{ required: true, message: '请输入宿主机 IP!' }]}
                    >
                        <Input placeholder={"示例: 21474836480"}/>
                    </Form.Item>
                </Form>
            </Drawer>

            <Space size={"middle"}>
                <Button type="primary"
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => apiQueryVolumeList().then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    刷新
                </Button>
                <Button type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}>新增数据盘</Button>
            </Space>
            <Table style={{marginTop: 15}} 
                    rowSelection={rowSelection}
                    columns={columns} 
                    dataSource={data}
                    rowKey={"volumeUuid"}
                    scroll={{x: 1000}}>
            </Table>
        </PageContainer>
    );
};
export default VmVolumePage;