import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form, Drawer, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag, Radio} from "antd";
import {ColumnsType} from "antd/es/table";
import {apiQueryMirrorList, apiMirrorDelete,apiMirrorCreate} from "@/api/VmMirror";
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
            dataIndex: 'mirrorZzid',
            ellipsis: {
                showTitle: false,
            },
            width: 50,
            fixed: "left",
        },
        {
            title: 'UUID',
            dataIndex: 'mirrorUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
        },
        {
            title: '镜像名称',
            dataIndex: 'mirrorName',
            ellipsis: {
                showTitle: false,
            },
            render: (mirrorName) => (
                <Tooltip placement="topLeft" title={mirrorName}>
                    {mirrorName}
                </Tooltip>
            ),
            width: 130
        },
        {
            title: '描述信息',
            dataIndex: 'mirrorDescription',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (mirrorDescription) => (
                <Tooltip placement="topLeft" title={mirrorDescription}>
                    {mirrorDescription ? mirrorDescription : "无"}
                </Tooltip>
            )
        },
        {
            title: '镜像架构',
            dataIndex: 'mirrorArchitecture',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (mirrorArchitecture) => (
                <Tooltip placement="topLeft" title={mirrorArchitecture}>
                    {mirrorArchitecture}
                </Tooltip>
            )
        },
        {
            title: '镜像系统',
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
            title: '虚拟化',
            dataIndex: 'mirrorVirtio',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (mirrorVirtio) => (
                <Tooltip placement="topLeft" title={mirrorVirtio}>
                    {mirrorVirtio == true ? "是" : "否"}
                </Tooltip>
            )
        },
        {
            title: '镜像地址',
            dataIndex: 'mirrorUrl',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (mirrorUrl) => (
                <Tooltip placement="topLeft" title={mirrorUrl}>
                    {mirrorUrl}
                </Tooltip>
            )
        },
        {
            title: '镜像类别',
            dataIndex: 'mirrorMediaType',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (mirrorMediaType) => (
                <Tooltip placement="topLeft" title={mirrorMediaType}>
                    {mirrorMediaType}
                </Tooltip>
            )
        },
        {
            title: '系统镜像',
            dataIndex: 'mirrorSystem',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (mirrorSystem) => (
                <Tooltip placement="topLeft" title={mirrorSystem}>
                    {mirrorSystem==true ? "是" : "否"}
                </Tooltip>
            )
        },
        {
            title: '镜像格式',
            dataIndex: 'mirrorFormat',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (mirrorFormat) => (
                <Tooltip placement="topLeft" title={mirrorFormat}>
                    {mirrorFormat}
                </Tooltip>
            )
        },
        {
            title: '镜像架构',
            dataIndex: 'mirrorPlatform',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (mirrorPlatform) => (
                <Tooltip placement="topLeft" title={mirrorPlatform}>
                    {mirrorPlatform}
                </Tooltip>
            )
        },
        {
            title: '镜像存储ID',
            dataIndex: 'mirrorBackupStorageUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (mirrorBackupStorageUuid) => (
                <Tooltip placement="topLeft" title={mirrorBackupStorageUuid}>
                    {mirrorBackupStorageUuid}
                </Tooltip>
            )
        },
        {
            title: '镜像标签',
            dataIndex: 'mirrorSystemTag',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (mirrorSystemTag) => (
                <Tooltip placement="topLeft" title={mirrorSystemTag}>
                    {mirrorSystemTag}
                </Tooltip>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'mirrorCreateTime',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (mirrorCreateTime) => (
                <Tooltip placement="topLeft" title={mirrorCreateTime}>
                    {mirrorCreateTime}
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

    // 钩子，启动时获取镜像列表
    useEffect(() => {
        apiQueryMirrorList().then(resp => {
            if (resp != null) {
                setData(resp);
            }
        })
    }, [])

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    // 打开新增镜像窗口
    const showAddModal = () => {
        addFormInstance.resetFields();
        setAddModalOpen(true);
    }
    // 打开修改镜像信息窗口
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
    // 新增镜像
    const submitAddModal = () => {
        apiMirrorCreate(addFormInstance.getFieldsValue()).then(respCode => {
            // 如果新增成功，刷新列表
            if (respCode == 200) {
                apiQueryMirrorList().then(resp => {
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
    // 取消新增镜像
    const cancelAddModal = () => {
        setAddModalOpen(false);
    }
    // 取消修改镜像
    const cancelUpdateModal = () => {
        setUpdateModalOpen(false);
    }
    // 删除镜像
    const deleteHost = (hostId: string) => {
        apiMirrorDelete(hostId).then(respCode => {
            // 如果镜像删除成功，刷新列表
            if (respCode == 200) {
                apiQueryMirrorList().then(resp => {
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
                title="新增镜像"
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
                        label="镜像名称"
                        name="mirrorName"
                        rules={[{ required: true, message: '请输入镜像名称' }]}
                    >
                        <Input placeholder={"test"}/>
                    </Form.Item>
                    <Form.Item
                        label="镜像地址"
                        name="mirrorUrl"
                        rules={[{ required: true, message: '请输入镜像地址' }]}
                    >
                        <Input placeholder={"file:///opt/zstack-dvd/zstack-image-1.4.qcow2"}/>
                    </Form.Item>
                    <Form.Item
                        label="镜像系统平台"
                        name="mirrorPlatform"
                        rules={[{ required: true, message: '请输入镜像系统平台' }]}
                    >
                        <Radio.Group>
                            <Radio value="Linux"> Linux </Radio>
                            <Radio value="Windows"> Windows </Radio>
                            <Radio value="Other"> Other </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="镜像格式"
                        name="mirrorFormat"
                        rules={[{ required: true, message: '请输入请输入镜像格式' }]}
                    >
                        <Radio.Group>
                            <Radio value="iso"> iso </Radio>
                            <Radio value="qcow2"> qcow2 </Radio>
                            <Radio value="raw"> raw </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="操作系统类型"
                        name="mirrorGuestOsType"
                        rules={[{ required: true, message: '请输入操作系统类型' }]}
                    >
                        <Input placeholder={"Kylin"}/>
                    </Form.Item>
                    <Form.Item
                        label="是否系统镜像"
                        name="mirrorSystem"
                        rules={[{ required: true, message: '请输入系统镜像' }]}
                    >
                        <Radio.Group>
                            <Radio value="true"> 是 </Radio>
                            <Radio value="false"> 否 </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="系统标签"
                        name="mirrorSystem"
                        rules={[{ required: true, message: '请输入系统标签' }]}
                    >
                        <Radio.Group>
                            <Radio value="Legacy"> bootMode::Legacy </Radio>
                            <Radio value="UEFI"> bootMode::UEFI </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="是否开启virtio"
                        name="mirrorVirtio"
                        rules={[{ required: true, message: '请输入是否开启virtio' }]}
                    >
                        <Radio.Group>
                            <Radio value="true"> 是 </Radio>
                            <Radio value="false"> 否 </Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="描述信息"
                        name="mirrorDescription"
                    >
                        <Input.TextArea showCount={true} placeholder={"最大长度为 500 个字符"} />
                    </Form.Item>
                </Form>
            </Drawer>

            <Space size={"middle"}>
                <Button type="primary"
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => apiQueryMirrorList().then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    刷新
                </Button>
                <Button type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}>新增镜像</Button>
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