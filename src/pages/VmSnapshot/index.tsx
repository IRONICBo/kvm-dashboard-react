import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form, Drawer, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag} from "antd";
import {ColumnsType} from "antd/es/table";
import {apiQuerySnapshotList, apiSnapshotDelete,apiSnapshotCreate,apiSnapshotRevert} from "@/api/VmSnapshot";
import { history } from 'umi';
import { RedoOutlined, PlusOutlined, PlayCircleOutlined, PauseCircleOutlined, PicRightOutlined, PicLeftOutlined } from '@ant-design/icons';

interface DataType {
    snapGroupUuid: string,
    snapGroupName: string,
}

interface HostIdProps {
    uuid: string;
}
const VmSnapshotPage: React.FC<HostIdProps> = (props) => {
    const UUID = props.uuid;
    console.log("UUID", UUID)
    const columns: ColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'snapGroupZzid',
            ellipsis: {
                showTitle: false,
            },
            width: 50,
            fixed: "left",
        },
        {
            title: 'UUID',
            dataIndex: 'snapGroupUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
        },
        {
            title: '快照名称',
            dataIndex: 'snapGroupName',
            ellipsis: {
                showTitle: false,
            },
            render: (snapGroupName) => (
                <Tooltip placement="topLeft" title={snapGroupName}>
                    {snapGroupName}
                </Tooltip>
            ),
            width: 130
        },
        {
            title: '虚拟机ID',
            dataIndex: 'snapGroupVmUuid',
            ellipsis: {
                showTitle: false,
            },
            render: (snapGroupVmUuid) => (
                <Tooltip placement="topLeft" title={snapGroupVmUuid}>
                    {snapGroupVmUuid}
                </Tooltip>
            ),
            width: 130
        },
        {
            title: '根云盘ID',
            dataIndex: 'snapGroupRootVolumeUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (snapGroupRootVolumeUuid) => (
                <Tooltip placement="topLeft" title={snapGroupRootVolumeUuid}>
                    {snapGroupRootVolumeUuid}
                </Tooltip>
            )
        },
        {
            title: '快照版本',
            dataIndex: 'snapGroupVersion',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (snapGroupVersion) => (
                <Tooltip placement="topLeft" title={snapGroupVersion}>
                    {snapGroupVersion}
                </Tooltip>
            )
        },
        {
            title: '快照类型',
            dataIndex: 'snapGroupType',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (snapGroupType) => (
                <Tooltip placement="topLeft" title={snapGroupType}>
                    {snapGroupType == null ? "无" : snapGroupType}
                </Tooltip>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'snapGroupCreateTime',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (snapGroupCreateTime) => (
                <Tooltip placement="topLeft" title={snapGroupCreateTime}>
                    {snapGroupCreateTime}
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
                    <Popconfirm title="Sure to revert?" onConfirm={() => revertSnapshot(record.snapGroupUuid)}>
                        <Button size={"small"} shape={"round"} type="dashed">恢复</Button>
                    </Popconfirm>
                    <Popconfirm title="Sure to delete?" onConfirm={() => deleteSnapshot(record.snapGroupUuid)}>
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

    // 钩子，启动时获取快照列表
    useEffect(() => {
        console.log("UUIDUUIDUUIDUUID", UUID)
        apiQuerySnapshotList(UUID).then(resp => {
            if (resp != null) {
                setData(resp);
            }
        })
    }, [])

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    // 打开新增快照窗口
    const showAddModal = () => {
        addFormInstance.resetFields();
        addFormInstance.setFieldsValue({
            vmUuid: UUID,
        });
        setAddModalOpen(true);
    }
    // 打开修改快照信息窗口
    const showUpdateModal = (record: DataType) => {
        setUpdateModalOpen(true);
        updateFormInstance.setFieldsValue({
            vmUuid: UUID,
        });
    }
    // 新增快照
    const submitAddModal = () => {
        const temp = addFormInstance.getFieldsValue()
        apiSnapshotCreate(temp.vmUuid, temp.snapGroupName).then(respCode => {
            // 如果新增成功，刷新列表
            if (respCode == 200) {
                apiQuerySnapshotList(UUID).then(resp => {
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
    // 取消新增快照
    const cancelAddModal = () => {
        setAddModalOpen(false);
    }
    // 取消修改快照
    const cancelUpdateModal = () => {
        setUpdateModalOpen(false);
    }
    // 删除快照
    const revertSnapshot = (snapGroupUuid: string) => {
        const data = {
            "snapGroupUuid": snapGroupUuid
        };
        apiSnapshotRevert(data).then(respCode => {
            // 如果快照删除成功，刷新列表
            if (respCode == 200) {
                apiQuerySnapshotList(UUID).then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
    }
    // 删除快照
    const deleteSnapshot = (hostId: string) => {
        apiSnapshotDelete(hostId).then(respCode => {
            // 如果快照删除成功，刷新列表
            if (respCode == 200) {
                apiQuerySnapshotList(UUID).then(resp => {
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
        <>
            <Drawer
                title="新增快照"
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
                        label="虚拟机ID"
                        name="vmUuid"
                        rules={[{ required: true, message: '请输入虚拟机ID' }]}
                    >
                        <Input disabled={true}/>
                    </Form.Item>

                    <Form.Item
                        label="快照名称"
                        name="snapGroupName"
                        rules={[{ required: true, message: '请输入快照名称!' }]}
                    >
                        <Input placeholder={"长度不超过 32 个字符"}/>
                    </Form.Item>
                </Form>
            </Drawer>

            <Space size={"middle"}>
                <Button type="primary"
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => apiQuerySnapshotList(UUID).then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    刷新
                </Button>
                <Button type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}>新增快照</Button>
            </Space>
            <Table style={{marginTop: 15}} 
                    rowSelection={rowSelection}
                    columns={columns} 
                    dataSource={data}
                    rowKey={"snapGroupUuid"}
                    scroll={{x: 1000}}>
            </Table>
        </>
    );
};
export default VmSnapshotPage;