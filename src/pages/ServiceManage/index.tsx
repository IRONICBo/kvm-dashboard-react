import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form, Drawer, Input, Select, Modal, Popconfirm, Space, Table, Tooltip, Tag, notification, Radio} from "antd";
import { ProDescriptions } from '@ant-design/pro-components';
import {ColumnsType} from "antd/es/table";
import {apiAddServiceMonitor, apiDeleteServiceMonitor, apiReplaceService, apiGetServiceList, apiGetAllServiceList, apiGetRunningServiceList, apiUpdateServiceMonitor } from "@/api/Service";
import { history } from 'umi';
import { RedoOutlined, PlusOutlined, PlayCircleOutlined, IssuesCloseOutlined} from '@ant-design/icons';
import { apiQueryVmList } from '@/api/VmManage';

interface DataType {
    key: number,
    value: string,
}

const ServiceManagePage: React.FC = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: '服务监控索引',
            dataIndex: 'serviceZzid',
            ellipsis: {
                showTitle: false,
            },
            width: 150,
            fixed: "left",
        },
        {
            title: '服务主机类型',
            dataIndex: 'serviceMachineType',
            ellipsis: {
                showTitle: false,
            },
            width: 100,
            fixed: "left",
            render: (serviceMachineType) => (
                (serviceMachineType == 1) ? <Tag color="green">虚拟机</Tag> : <Tag color="red">物理机</Tag>
            ),
        },
        {
            title: '服务主机标识',
            dataIndex: 'serviceMachineUuid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            fixed: "left",
        },
        {
            title: '服务名称',
            dataIndex: 'serviceName',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (serviceName) => (
                <Tooltip placement="topLeft" title={serviceName}>
                    {serviceName}
                </Tooltip>
            ),
        },
        {
            title: '服务替换名称',
            dataIndex: 'serviceReplaceName',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (serviceReplaceName) => (
                <Tooltip placement="topLeft" title={serviceReplaceName}>
                    {serviceReplaceName}
                </Tooltip>
            ),
        },
        {
            title: '服务进程标识',
            dataIndex: 'servicePid',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (servicePid) => (
                <Tooltip placement="topLeft" title={servicePid}>
                    {servicePid}
                </Tooltip>
            ),
        },
        {
            title: '处理器上限',
            dataIndex: 'serviceCpuLimitRate',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (serviceCpuLimitRate) => (
                <Tooltip placement="topLeft" title={serviceCpuLimitRate}>
                    {serviceCpuLimitRate}
                </Tooltip>
            ),
        },
        {
            title: '内存上限',
            dataIndex: 'serviceMemLimitRate',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (serviceMemLimitRate) => (
                <Tooltip placement="topLeft" title={serviceMemLimitRate}>
                    {serviceMemLimitRate}
                </Tooltip>
            ),
        },
        {
            title: '服务质量得分下限',
            dataIndex: 'serviceHealthLimitScore',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (serviceHealthLimitScore) => (
                <Tooltip placement="topLeft" title={serviceHealthLimitScore}>
                    {serviceHealthLimitScore}
                </Tooltip>
            ),
        },
        {
            title: '自动迁移',
            dataIndex: 'serviceAutoType',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (serviceHealthLimitScore) => (
                (serviceHealthLimitScore == 1) ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>
            ),
        },
        {
            title: '服务配置时间',
            dataIndex: 'serviceAddTime',
            ellipsis: {
                showTitle: false,
            },
            width: 150,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 250,
            render: (_, record) =>
                <Space>
                    <Popconfirm title="Sure to delete?" onConfirm={() => apiDeleteServiceMonitor(record.serviceZzid)}>
                        <Button size={"small"} shape={"round"} danger={true} type="dashed">删除</Button>
                    </Popconfirm>
                    <Popconfirm title="Sure to update?" onConfirm={() => showUpdateModal(record)}>
                        <Button size={"small"} shape={"round"} danger={false} type="dashed">更新</Button>
                    </Popconfirm>
                    <Popconfirm title="Sure to replace?" onConfirm={() => showReplaceModal(record)}>
                        <Button size={"small"} shape={"round"} danger={false} type="dashed">替换</Button>
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
    let [replaceModalOpen, setReplaceModalOpen] = useState(false);
    let [getDetailOpen, setGetDetailOpen] = useState(false);
    let [addFormInstance] = Form.useForm();
    let [updateFormInstance] = Form.useForm();
    let [replaceFormInstance] = Form.useForm();
    let [influxSecond, setInfluxSecond] = useState([{'key': 'db', 'value': '0'}]);
    let [backupData, setBackupData] = useState([]);
    const [apiNotification, contextHolder] = notification.useNotification();
    let [vmList, setVmList] = useState([]);

    // 钩子，启动时获取系统配置列表
    useEffect(() => {
        apiGetServiceList().then(resp => {
            if (resp != null) {
                setData(resp);
            }
        })
        try {
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
        } catch (error) {
            console.error('Error retrieving guest infos:', error);
        }
    }, [])

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    // 打开详细信息
    const showGetDetailOpen = (hostUuid: String) => {
        const res = data.find(item => item.key == key)
        console.log("showGetDetailOpen", res)
        setSelectData(res);
        setGetDetailOpen(true);
    }
    // 打开新增系统配置窗口
    const showAddModal = () => {
        addFormInstance.resetFields();
        setAddModalOpen(true);
    }
    // 打开修改系统配置信息窗口
    const showUpdateModal = (record: DataType) => {
        setUpdateModalOpen(true);
        updateFormInstance.setFieldsValue({
            "serviceAutoType": record.serviceAutoType,
            "serviceCpuLimitRate": record.serviceCpuLimitRate,
            "serviceHealthLimitScore": record.serviceHealthLimitScore,
            "serviceMemLimitRate": record.serviceMemLimitRate,
            "servicePid": record.servicePid,
            "serviceReplaceName": record.serviceReplaceName,
            "serviceZzid": record.serviceZzid,
        });
    }
    const showReplaceModal = (record: DataType) => {
        setReplaceModalOpen(true);
        replaceFormInstance.setFieldsValue({
            "serviceAutoType": record.serviceAutoType,
            "serviceCpuLimitRate": record.serviceCpuLimitRate,
            "serviceHealthLimitScore": record.serviceHealthLimitScore,
            "serviceMemLimitRate": record.serviceMemLimitRate,
            "servicePid": record.servicePid,
            "serviceReplaceName": record.serviceReplaceName,
            "serviceZzid": record.serviceZzid,
            "serviceMachineUuid": record.serviceMachineUuid,
            "serviceName": record.serviceName,
        });
    }       
    const showSysUpdateModal = (record: DataType) => {
        setUpdateModalOpen(true);
        updateFormInstance.setFieldsValue({
            key: record.configKey,
            value: record.configValue,
        });
    }
    const submitAddModal = () => {
        apiAddServiceMonitor(addFormInstance.getFieldsValue()).then(respCode => {
            // 如果新增成功，刷新列表
            if (respCode == 200) {
                apiGetServiceList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
                setAddModalOpen(false);
            }
        })
    }
    // 修改系统配置信息
    const submitUpdateModal = () => {
        apiUpdateServiceMonitor(updateFormInstance.getFieldsValue()).then(respCode => {
            // 如果修改成功，刷新列表
            if (respCode == 200) {
                apiGetServiceList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
                setUpdateModalOpen(false);
            }
        })
    }
    const submitReplaceModal = () => {
        apiReplaceService(replaceFormInstance.getFieldsValue()).then(respCode => {
            // 如果修改成功，刷新列表
            if (respCode == 200) {
                apiGetServiceList().then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
                setReplaceModalOpen(false);
            }
        })
    }
    // 关闭详细信息窗口
    const cancelGetDetail = () => {
        setGetDetailOpen(false);
    }
    // 取消新增系统配置
    const cancelAddModal = () => {
        setAddModalOpen(false);
    }
    // 取消修改系统配置
    const cancelUpdateModal = () => {
        setUpdateModalOpen(false);
    }
    const cancelReplaceModal = () => {
        setReplaceModalOpen(false);
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
                title="新增服务监控"
                open={addModalOpen}
                onClose={cancelAddModal}
                width={720}
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
                    form={addFormInstance}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Form.Item
                        label="服务自动调整类型"
                        name="serviceAutoType"
                        rules={[{ required: true, message: '请输入服务自动调整类型!' }]}
                    >
                        <Radio.Group>
                            <Radio value={1}>半自动</Radio>
                            <Radio value={2}>自动</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="服务 CPU 上限占用率"
                        name="serviceCpuLimitRate"
                        rules={[{ required: true, message: '请输入服务 CPU 上限占用率!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="服务 内存 上限占用率"
                        name="serviceMemLimitRate"
                        rules={[{ required: true, message: '请输入服务 内存 上限占用率!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="服务健康值分数下限值"
                        name="serviceHealthLimitScore"
                        rules={[{ required: true, message: '请输入服务健康值分数下限值!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="当前服务名称"
                        name="serviceName"
                        rules={[{ required: true, message: '请输入服务健康值分数下限值!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="预备替换服务名称"
                        name="serviceReplaceName"
                        rules={[{ required: true, message: '请输入服务健康值分数下限值!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="服务所属节点UUID"
                        name="serviceMachineUuid"
                        rules={[{ required: true, message: '请输入服务所属节点UUID!' }]}
                    >
                        <Select
                            placeholder="选择一个节点"
                            allowClear
                            options={vmList}
                        />
                    </Form.Item>
                </Form>
            </Drawer>
            <Drawer
                title="服务监控修改"
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
                        label="服务自动调整类型"
                        name="serviceAutoType"
                        rules={[{ required: true, message: '请输入服务自动调整类型!' }]}
                    >
                        <Radio.Group>
                            <Radio value={1}>半自动</Radio>
                            <Radio value={2}>自动</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="服务 CPU 上限占用率"
                        name="serviceCpuLimitRate"
                        rules={[{ required: true, message: '请输入服务 CPU 上限占用率!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="服务 内存 上限占用率"
                        name="serviceMemLimitRate"
                        rules={[{ required: true, message: '请输入服务 内存 上限占用率!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="服务健康值分数下限值"
                        name="serviceHealthLimitScore"
                        rules={[{ required: true, message: '请输入服务健康值分数下限值!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item>
                    {/* <Form.Item
                        label="当前服务名称"
                        name="serviceName"
                        rules={[{ required: true, message: '请输入服务健康值分数下限值!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item> */}
                    <Form.Item
                        label="预备替换服务名称"
                        name="serviceReplaceName"
                        rules={[{ required: true, message: '请输入服务健康值分数下限值!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="服务监控标识"
                        name="serviceZzid"
                        rules={[{ required: true, message: '请输入服务监控标识!' }]}
                    >
                        <Input disabled placeholder={"xxx"}/>
                    </Form.Item>
                </Form>
            </Drawer>
            <Drawer
                title="服务监控替换"
                open={replaceModalOpen}
                onClose={cancelReplaceModal}
                width={720}
                styles={{
                    body: {
                      paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                      <Button onClick={cancelReplaceModal}>取消</Button>
                      <Button onClick={submitReplaceModal} type="primary">
                        确认
                      </Button>
                    </Space>
                  }
            >
                <Form
                    form={replaceFormInstance}
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Form.Item
                        label="服务所属节点类型"
                        name="serviceMachineType"
                        rules={[{ required: true, message: '请输入服务所属节点类型!' }]}
                    >
                        <Radio.Group>
                            <Radio value={1}>虚拟机</Radio>
                            <Radio value={2}>物理机</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="当前服务名称"
                        name="serviceName"
                        rules={[{ required: true, message: '请输入服务健康值分数下限值!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="预备替换服务名称"
                        name="serviceReplaceName"
                        rules={[{ required: true, message: '请输入服务健康值分数下限值!' }]}
                    >
                        <Input placeholder={"xxx"}/>
                    </Form.Item>
                    <Form.Item
                        label="服务监控标识"
                        name="serviceMachineUuid"
                        rules={[{ required: true, message: '请输入服务监控标识!' }]}
                    >
                        <Input disabled placeholder={"xxx"}/>
                    </Form.Item>
                </Form>
            </Drawer>

            <Space size={"middle"}>
                <Button type="primary"
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => apiGetServiceList().then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }
                        })}>
                    刷新
                </Button>
                <Button type="dashed"
                    size="large"
                        onClick={() => {
                            showAddModal();
                        }}>
                    新增
                </Button>
            </Space>
            <ProDescriptions
                    style={{
                        "paddingTop": 20
                    }} title="服务监控" column={2} layout="vertical" />
            <Table style={{marginTop: 15}} 
                    columns={columns} 
                    dataSource={data}
                    rowKey={"key"}
                    pagination={false}
                    scroll={{x: 1000}} />
        </PageContainer>
    );
};
export default ServiceManagePage;