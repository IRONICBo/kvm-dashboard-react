import React, {useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {
    Alert,
    Button,
    Col,
    Collapse,
    Drawer,
    Form,
    Input,
    InputNumber, message, notification, Popconfirm,
    Radio, Result,
    Row,
    Select,
    Slider,
    Space, Spin,
    Steps,
    Table,
    Tooltip
} from "antd";
import {apiGetSimpleHostList} from "@/api/HostManage";
import TextArea from "antd/es/input/TextArea";
import {FileTextOutlined, FolderOutlined, SmileOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {apiCreateVirtual, apiQueryBridgeList, apiQueryResource} from "@/api/VmCreate";
import ReactJson from "react-json-view";

const {Panel} = Collapse;
const { Option } = Select;

const stepsItem = [
    {
        title: '基本信息',
        description: "Basic information about the VM"
    },
    {
        title: '镜像选择',
        description: "Virtual machine image selection"
    },
    {
        title: '高级配置',
        description: "Advanced information"
    },
    {
        title: '信息确认',
        description: "Confirm the VM information"
    },
    {
        title: '创建完成',
        description: "VM status information"
    }
]

interface TableDataType {
    resourceName: string,
    isDirectory: boolean,
    resourceSize: string,
    resourceModifyTime: string
}

const vmObjectMap: Map<string, any> = new Map();

const VmCreatePage: React.FC = () => {
    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    let [current, setCurrent] = useState(0);
    let [vmCreateForm, setVmCreateForm] = useState(0);
    let [formInstance] = Form.useForm();
    let [tempHostList, setTempHostList] = useState([]);
    let [tempBridgeList, setTempBridgeList] = useState([]);

    let [cpuThrv, setCpuThrv] = useState(0.9);
    let [memoryThrv, setMemoryThrv] = useState(0.9);
    let [diskThrv, setDiskThrv] = useState(0.9);

    let [drawStatus1, setDrawStatus1] = useState(false);
    let [drawStatus2, setDrawStatus2] = useState(false);

    let [drawPath, setDrawPath] = useState('/');
    let [drawTabelLoading, setDrawTableLoading] = useState(false);
    let [drawTableData, setDrawTableData] = useState([]);
    let [jsonObject, setJsonObject] = useState({});
    let queryResourceParam = {uuid: '', path: ''}
    let [resultIndex, setResultIndex] = useState(0);


    useEffect(() => {
        vmObjectMap.clear();
        apiGetSimpleHostList().then(resp => {
            if (resp != null) {
                setTempHostList(resp);
            }
        })

    }, [])


    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    const openDraw1 = () => {
        // 初始化：清空 table 数据
        setDrawTableData([]);
        // 初始化：初始化当前路径
        setDrawPath("/");
        // 打开 draw
        setDrawStatus1(true);
        // 打开 loading 图标
        setDrawTableLoading(true);
        // 请求资源列表
        queryResource("/");
    }
    const openDraw2 = () => {
        // 初始化：清空 table 数据
        setDrawTableData([]);
        // 初始化：初始化当前路径
        setDrawPath("/");
        // 打开 draw
        setDrawStatus2(true);
        // 打开 loading 图标
        setDrawTableLoading(true);
        // 请求资源列表
        queryResource("/")
    }
    const closeDraw1 = () => {
        setDrawStatus1(false);
    }
    const closeDraw2 = () => {
        setDrawStatus2(false);
    }

    const next = () => {
        let data = formInstance.getFieldsValue();
        Object.keys(data).forEach((key) => {
            if (data[key] == undefined) {
                vmObjectMap.set(key, '');
            } else {
                vmObjectMap.set(key, data[key]);
            }
        })
        console.log(vmObjectMap);
        let tempJsonObject = {};
        vmObjectMap.forEach((value, key) => {
            // @ts-ignore
            tempJsonObject[key] = value
        });
        setJsonObject(tempJsonObject);
        // console.log(JSON.stringify(jsonObject))

        // console.log(current);
        // 处理高级配置中的桥接网卡选择
        if (current == 1) {
            queryBridgeList(vmObjectMap.get("vmHostId"))
        }

        if (current < stepsItem.length - 1) {
            setCurrent(current + 1);
        }
    };

    const prev = () => {
        if (current > 0) {
            setCurrent(current - 1);
        }
    };

    const confirmCreateVm = () => {
        // 接口和后端对接
        if (current < stepsItem.length - 1) {
            setCurrent(current + 1);
        }
        apiCreateVirtual(jsonObject).then(resp => {
            if (resp != null) {
                setResultIndex(1);
                openNotification(resp.name, resp.uuid, resp.ip);
            } else {
                setResultIndex(2);
            }
        })
    }

    const openNotification = (name: string, uuid: string, ip: string) => {
        notification.success({
            message: "虚拟机配置参数, 请拷贝!",
            description: "虚拟机名称: " + name + "\n虚拟机ID: " + uuid + "\n宿主机通信IP: " + ip,
            duration: 0
        })
    }

    const queryBridgeList = (hostId: string) => {
        if (hostId == null || hostId.length == 0) {
            message.warn("请选择宿主机！");
            return;
        }
        apiQueryBridgeList(hostId).then(resp => {
            if (resp != null) {
                console.log(resp);
                // @ts-ignore
                setTempBridgeList(resp);
            }
        })
    }

     const queryResource = (path: string) => {
        if (vmObjectMap.get("vmHostId") == "") {
            // 关闭 loading 图标
            setDrawTableLoading(false);
            message.error("宿主机未选择！");
            return;
        }
        queryResourceParam.uuid = vmObjectMap.get("vmHostId");
        queryResourceParam.path = path;
        apiQueryResource(queryResourceParam).then(resp => {
            if (resp != null) {
                setDrawTableData(resp);
                // 关闭 loading 图标
                setDrawTableLoading(false);
            }
        });
    }

    /**
     * 处理资源(文件)选择
     * @param record
     */
    const handleResourceSelect = (record: TableDataType) => {
        if (record.isDirectory == false) {
            let temp = drawPath + record.resourceName;
            setDrawPath(temp);
            formInstance.setFieldValue("vmDevicesDiskImageSourcepath", temp);
            setDrawStatus1(false);

        } else {
            if (record.resourceName == "..") {
                if (drawPath.length < 2) {
                    return;
                }
                let temp1 = drawPath.substring(0, drawPath.length - 1);
                let newPath = temp1.substring(0, temp1.lastIndexOf("/") + 1);
                // 更新当前路径
                setDrawPath(newPath);
                // 打开 loading 图标
                setDrawTableLoading(true);
                // 发送资源请求
                queryResource(newPath);
            } else {
                // 更新当前路径
                let temp = drawPath + record.resourceName + "/";
                setDrawPath(temp);
                // 打开 loading 图标
                setDrawTableLoading(true);
                // 发送资源请求
                queryResource(temp);

            }
        }
    }

    /**
     * 处理文件夹选择
     * @param record
     */
    const handleFolderSelect = (record: TableDataType) => {
        if (record.isDirectory == false) {
            message.warn("当前资源非文件夹，选择失败！");
        } else {
            if (record.resourceName == "..") {
                if (drawPath.length < 2) {
                    return;
                }
                let temp1 = drawPath.substring(0, drawPath.length - 1);
                let newPath = temp1.substring(0, temp1.lastIndexOf("/") + 1);
                // 更新当前路径
                setDrawPath(newPath);
                // 打开 loading 图标
                setDrawTableLoading(true);
                // 发送资源请求
                queryResource(newPath);
            } else {
                // 更新当前路径
                let temp = drawPath + record.resourceName + "/";
                setDrawPath(temp);
                // 打开 loading 图标
                setDrawTableLoading(true);
                // 发送资源请求
                queryResource(temp);

            }
        }
    }

    const confirmFolderPath = () => {
        let temp = drawPath.length > 1 ? drawPath.substring(0, drawPath.length - 1) : drawPath;
        formInstance.setFieldValue("vmDevicesDiskSourcepath", temp);
        setDrawStatus2(false);
    }

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    const columns1: ColumnsType<TableDataType> = [
        {
            title: '资源名称',
            dataIndex: 'resourceName',
            ellipsis: {
                showTitle: false,
            },
            render: (resourceName) => (
                <Tooltip placement="topLeft" title={resourceName}>
                    {resourceName}
                </Tooltip>
            )
        },
        {
            title: '是否为目录',
            dataIndex: 'isDirectory',
            ellipsis: {
                showTitle: false,
            },
            render: (isDirectory) => (
                <span>{isDirectory == false ? "false" : "true"}</span>
            ),
            width: 140
        },
        {
            title: '资源大小',
            dataIndex: 'resourceSize',
            ellipsis: {
                showTitle: false,
            },
            render: (resourceSize) => (
                <span>{resourceSize != null && resourceSize != ".." ? resourceSize + " MB" : ""}</span>
            ),
            width: 130
        },
        {
            title: '修改时间',
            dataIndex: 'resourceModifyTime',
            ellipsis: {
                showTitle: false,
            },
            render: (resourceModifyTime) => (
                <Tooltip placement="topLeft" title={resourceModifyTime}>
                    {resourceModifyTime}
                </Tooltip>
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            render: (_, record) => (
                <Button size={"small"} shape={"round"} type="primary" onClick={() => handleResourceSelect(record)} >选择</Button>
            ),
            width: 100
        },
    ];


    const columns2: ColumnsType<TableDataType> = [
        {
            title: '资源名称',
            dataIndex: 'resourceName',
            ellipsis: {
                showTitle: false,
            },
            render: (resourceName) => (
                <Tooltip placement="topLeft" title={resourceName}>
                    {resourceName}
                </Tooltip>
            )
        },
        {
            title: '是否为目录',
            dataIndex: 'isDirectory',
            ellipsis: {
                showTitle: false,
            },
            render: (isDirectory) => (
                <span>{isDirectory == false ? "false" : "true"}</span>
            ),
            width: 140
        },
        {
            title: '资源大小',
            dataIndex: 'resourceSize',
            ellipsis: {
                showTitle: false,
            },
            render: (resourceSize) => (
                <span>{resourceSize != null && resourceSize != ".." ? resourceSize + " MB" : ""}</span>
            ),
            width: 130
        },
        {
            title: '修改时间',
            dataIndex: 'resourceModifyTime',
            ellipsis: {
                showTitle: false,
            },
            render: (resourceModifyTime) => (
                <Tooltip placement="topLeft" title={resourceModifyTime}>
                    {resourceModifyTime}
                </Tooltip>
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            render: (_, record) => (
                <Button size={"small"} shape={"round"} type="primary" onClick={() => handleFolderSelect(record)} >选择</Button>
            ),
            width: 100
        },
    ];


    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    return (
        <>
            <Drawer title="ISO/CDROM 镜像路径选择" placement="right" onClose={closeDraw1} open={drawStatus1} width={"60%"}>
                <span style={{marginLeft: 10, color: "steelblue"}}>当前路径：{drawPath}</span>
                <Table style={{marginTop: 10}} columns={columns1} dataSource={drawTableData} pagination={false} loading={drawTabelLoading} rowKey={"resourceName"} ></Table>
            </Drawer>
            <Drawer title="Disk 磁盘安装路径选择" placement="right" onClose={closeDraw2} open={drawStatus2} width={"60%"}>
                <Space size={"large"}>
                    <Button type={"primary"} shape={"round"} onClick={confirmFolderPath}>路径确认</Button>
                    <span style={{color: "steelblue"}}>当前路径：{drawPath}</span>
                </Space>
                <Table style={{marginTop: 10}} columns={columns2} dataSource={drawTableData} pagination={false} loading={drawTabelLoading} rowKey={"resourceName"} ></Table>
            </Drawer>


            {/*----------------------------------------------------------------------------------------------------------------*/}


            <PageContainer>
                <Steps
                    current={current}
                    percent={60}
                    items={stepsItem}
                />
                {current === 0 && (
                    <Row justify="space-around" align="middle" style={{marginTop: 70}}>
                        <Col span={11}>
                            <Form
                                form={formInstance}
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 12 }}
                            >
                                <Form.Item
                                    label="虚拟机名称"
                                    name="vmName"
                                    rules={[{ required: true, message: '请输入虚拟机名称!' }]}
                                >
                                    <Input placeholder={"请输入虚拟机名称"}/>
                                </Form.Item>
                                <Form.Item
                                    label="虚拟机方案"
                                    name="vmType"
                                    rules={[{ required: true, message: '请选择虚拟机方案!' }]}
                                    initialValue={"kvm"}
                                >
                                    <Select
                                        defaultValue={"kvm"}
                                    >
                                        <Option value="kvm">kvm</Option>
                                        <Option value="xen">xen</Option>
                                        <Option value="qemu">qemu</Option>
                                        <Option value="lxc">lxc</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="宿主机选择"
                                    name="vmHostId"
                                    rules={[{ required: true, message: '请选择宿主机!' }]}
                                >
                                    <Select placeholder={"请选择宿主机"}>
                                        {tempHostList && tempHostList.map(({hostId, hostName}) => (
                                            <Option key={hostId}>{hostName}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="虚拟机简介"
                                    name="vmDescription"
                                >
                                    <TextArea rows={3} showCount={true} placeholder={"最大长度为 500 个字符"}/>
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col span={13}>
                            <Form
                                form={formInstance}
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 11 }}
                            >
                                <Form.Item
                                    label="虚拟机 CPU 架构"
                                    name="vmOsTypeArch"
                                    rules={[{ required: true, message: '请选择 CPU 架构!' }]}
                                    initialValue={"aarch64"}
                                >
                                    <Select
                                        defaultValue={"aarch64"}
                                    >
                                        <Option value="aarch64">aarch64</Option>
                                        <Option value="x86_64">x86_64</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="虚拟机机器类型"
                                    name="vmOsTypeMachine"
                                    rules={[{ required: true, message: '请选择机器类型!' }]}
                                    initialValue={"virt"}
                                >
                                    <Select
                                        defaultValue={"virt"}
                                    >
                                        <Option value="virt">virt</Option>
                                        <Option value="pc">pc</Option>
                                        <Option value="q35">q35</Option>
                                        <Option value="pc-q35-5.2">pc-q35-5.2</Option>
                                        <Option value="pc-q35-4.2">pc-q35-4.2</Option>
                                        <Option value="pc-q35-2.7">pc-q35-2.7</Option>
                                        <Option value="pc-q35-7.1">pc-q35-7.1</Option>
                                        <Option value="pc-i440fx-7.1">pc-i440fx-7.1</Option>
                                        <Option value="pc-i440fx-2.12">pc-i440fx-2.12</Option>
                                        <Option value="pc-i440fx-2.0">pc-i440fx-2.0</Option>
                                        <Option value="pc-i440fx-6.2">pc-i440fx-6.2</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="虚拟化 OS 类型"
                                    name="vmOsType"
                                    rules={[{ required: true, message: '请选择 OS 类型!' }]}
                                    initialValue={"hvm"}
                                >
                                    <Select
                                        defaultValue={"hvm"}
                                    >
                                        <Option value="hvm">hvm</Option>
                                        <Option value="xen">xen</Option>
                                        <Option value="exe">exe</Option>
                                        <Option value="linux">linux</Option>
                                        <Option value="xenpvh">xenpvh</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="CPU 使用率告警阈值"
                                    name="vmThvCpu"
                                    rules={[{ required: true, message: '请输入 CPU 使用率告警阈值!' }]}
                                    initialValue={0.90}
                                >
                                    <Slider
                                        min={0}
                                        max={1}
                                        onChange={setCpuThrv}
                                        value={typeof cpuThrv === 'number' ? cpuThrv : 0.9}
                                        step={0.01}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="内存 使用率告警阈值"
                                    name="vmThvMemory"
                                    rules={[{ required: true, message: '请输入 内存 使用率告警阈值!' }]}
                                    initialValue={0.90}
                                >
                                    <Slider
                                        min={0}
                                        max={1}
                                        onChange={setMemoryThrv}
                                        value={typeof memoryThrv === 'number' ? memoryThrv : 0.9}
                                        step={0.01}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="磁盘 使用率告警阈值"
                                    name="vmThvDisk"
                                    rules={[{ required: true, message: '请输入 磁盘 使用率告警阈值!' }]}
                                    initialValue={0.90}
                                >
                                    <Slider
                                        min={0}
                                        max={1}
                                        onChange={setDiskThrv}
                                        value={typeof diskThrv === 'number' ? diskThrv : 0.9}
                                        step={0.01}
                                    />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                )}
                {current === 1 && (
                    <Row justify="space-around" align="middle" style={{marginTop: 70}}>
                        <Col span={11}>
                            <Form
                                form={formInstance}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 13 }}
                            >
                                <Form.Item
                                    label="虚拟机安装介质"
                                    name="vmCreateForm"
                                    rules={[{ required: true, message: '请选择虚拟机安装介质!' }]}
                                    initialValue={0}
                                >
                                    <Radio.Group onChange={(e) => setVmCreateForm(e.target.value)} value={vmCreateForm} defaultValue={0}>
                                        <Space direction="vertical">
                                            <Radio value={0}>本地安装介质 (IOS or CDROM)</Radio>
                                            <Radio value={1}>现有磁盘镜像 (Disk Image)</Radio>
                                            <Radio disabled={true} value={2}>网络安装 (Http or Https or FTP)</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    label="原生/本地-镜像路径"
                                    name="vmDevicesDiskImageSourcepath"
                                    rules={[{ required: true, message: '请输入原生/本地-镜像路径!' }]}
                                >
                                    <Row>
                                        <Col span={19}>
                                            <Input placeholder={"示例: /root/kylin-arm64.iso"} value={formInstance.getFieldValue("vmDevicesDiskImageSourcepath")}/>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={4}>
                                            <Button type={"primary"} shape={"round"} icon={<FileTextOutlined />} onClick={openDraw1}/>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                {vmCreateForm === 0 && (
                                    <div>
                                        <Form.Item
                                            label="Disk 磁盘安装路径"
                                            name="vmDevicesDiskSourcepath"
                                            rules={[{ required: true, message: '请输入 Disk 磁盘安装路径!' }]}
                                        >
                                            <Row>
                                                <Col span={19}>
                                                    <Input placeholder={"示例: /root/images"} value={formInstance.getFieldValue("vmDevicesDiskSourcepath")}/>
                                                </Col>
                                                <Col span={1}></Col>
                                                <Col span={4}>
                                                    <Button type={"primary"} shape={"round"} icon={<FolderOutlined />} onClick={openDraw2} />
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                        <Form.Item
                                            label="Disk 磁盘类型选择"
                                            name="vmDevicesDiskDriverType"
                                            rules={[{ required: true, message: '请输入 Disk 磁盘类型选择!' }]}
                                            initialValue={"qcow2"}
                                        >
                                            <Radio.Group defaultValue={"qcow2"}>
                                                <Space>
                                                    <Radio value={"qcow2"}>qcow2</Radio>
                                                    <Radio value={"raw"}>raw</Radio>
                                                </Space>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item
                                            label="虚拟机磁盘容量"
                                            name="vmDevicesDiskSize"
                                            rules={[{ required: true, message: '请输入虚拟机磁盘容量!' }]}
                                            initialValue={20}
                                        >
                                            <InputNumber precision={0} min={15} defaultValue={20} addonAfter={"GB"}/>
                                        </Form.Item>

                                    </div>
                                )}
                            </Form>
                        </Col>
                        <Col span={13}>
                            <Form
                                form={formInstance}
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 11 }}
                            >
                                <Form.Item
                                    label="虚拟机 CPU 数量"
                                    name="vmCpus"
                                    rules={[{ required: true, message: '请输入虚拟机 CPU 数量!' }]}
                                    initialValue={1}
                                >
                                    <InputNumber precision={0} min={1} defaultValue={1} addonAfter={"个"}/>
                                </Form.Item>
                                <Form.Item
                                    label="虚拟机内存分配"
                                    name="vmMemory"
                                    rules={[{ required: true, message: '请输入虚拟机内存分配!' }]}
                                    initialValue={1024}
                                >
                                    <InputNumber precision={0} min={256} defaultValue={1024} addonAfter={"MB"}/>
                                </Form.Item>
                                <Form.Item
                                    label="网络输入带宽限制"
                                    name="vmInterfaceBandwidthInboundAverage"
                                >
                                    <InputNumber precision={0} addonAfter={"KB/s"} placeholder={"默认为空-(无限制)"}/>
                                </Form.Item>
                                <Form.Item
                                    label="网络输出带宽限制(KB/s)"
                                    name="vmInterfaceBandwidthOutboundAverage"
                                >
                                    <InputNumber precision={0} addonAfter={"KB/s"} placeholder={"默认为空-(无限制)"}/>
                                </Form.Item>
                                <Form.Item
                                    label="虚拟机虚拟网卡类型"
                                    name="vmInterfaceType"
                                    rules={[{ required: true, message: '请选择虚拟网卡类型!' }]}
                                    initialValue={"network"}
                                >
                                    <Select
                                        defaultValue={"network"}
                                    >
                                        <Option value="network">network</Option>
                                        <Option value="bridge">bridge</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="虚拟机网卡 MAC 地址"
                                    name="vmInterfaceMacAddress"
                                >
                                    <Input placeholder={"默认为空-(自动生成)"} />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                )}
                {current === 2 && (
                    <Collapse ghost={true} defaultActiveKey={['1', '2', '3', '4', '5']} style={{marginTop: 20, marginLeft: 20}}>
                        <Panel header="虚拟机 CPU 高级配置" key="1">
                            <Form
                                form={formInstance}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 8 }}
                            >
                                <Form.Item
                                    label="CPU Mode"
                                    name="vmCpuMode"
                                    initialValue={"host-passthrough"}
                                >
                                    <Select placeholder={"请选择虚拟机 CPU 模式"} defaultValue={"host-passthrough"}>
                                        <Option value="host-passthrough">host-passthrough</Option>
                                        <Option value="host-model">host-model</Option>
                                        <Option value="custom">custom</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="CPU Model-Fallback"
                                    name="vmCpuModelFallback"
                                >
                                    <Radio.Group>
                                        <Space>
                                            <Radio value={"allow"}>allow</Radio>
                                            <Radio value={"forbid"}>forbid</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    label="CPU Model-Value"
                                    name="vmCpuModelValue"
                                >
                                    <Input placeholder={"请设置 CPU 模型值"}/>
                                </Form.Item>
                                <Form.Item
                                    label="CPU Vendor-ID"
                                    name="vmCpuVendorid"
                                >
                                    <Input placeholder={"请设置 CPU 供应商 ID"}/>
                                </Form.Item>
                                <Form.Item
                                    label="CPU Topology-Sockets"
                                    name="vmCpuTopologySocket"
                                >
                                    <Input placeholder={"请设置 CPU 插槽总数"}/>
                                </Form.Item>
                                <Form.Item
                                    label="CPU Topology-Dies"
                                    name="vmCpuTopologyDies"
                                >
                                    <Input placeholder={"请设置 CPU 每个插槽的裸片数"} />
                                </Form.Item>
                                <Form.Item
                                    label="CPU Topology-Cores"
                                    name="vmCpuTopologyCores"
                                >
                                    <Input placeholder={"请设置 CPU 每个路裸片的内核数"} />
                                </Form.Item>
                                <Form.Item
                                    label="CPU Topology-Threads"
                                    name="vmCpuTopologyThreads"
                                >
                                    <Input placeholder={"请设置 CPU 每个内核的线程数"} />
                                </Form.Item>
                                <Form.Item
                                    label="CPU Feature-Policy"
                                    name="vmCpuFeaturePolicy"
                                >
                                    <Select placeholder={"请选择虚拟机 CPU 特性策略"}>
                                        <Option value="force">force</Option>
                                        <Option value="require">require</Option>
                                        <Option value="optional">optional</Option>
                                        <Option value="disable">disable</Option>
                                        <Option value="forbid">forbid</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="CPU Feature-Name"
                                    name="vmCpuFeatureName"
                                >
                                    <Input placeholder={"请为 CPU 特性指定名称"} />
                                </Form.Item>
                            </Form>
                        </Panel>
                        <Panel header="虚拟机 Disk 磁盘高级配置" key="2">
                            <Form
                                form={formInstance}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 8 }}
                            >
                                <Form.Item
                                    label="Disk Type"
                                    name="vmDevicesDiskType"
                                    initialValue={"file"}
                                >
                                    <Select placeholder={"请选择 Disk 磁盘设备类型"} defaultValue={"file"}>
                                        <Option value="file">file</Option>
                                        <Option value="block">block</Option>
                                        <Option value="dir">dir</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Disk Device"
                                    name="vmDevicesDiskDevice"
                                    initialValue={"disk"}
                                >
                                    <Radio.Group defaultValue={"disk"}>
                                        <Space>
                                            <Radio value={"disk"}>disk</Radio>
                                            <Radio value={"cdrom"}>cdrom</Radio>
                                            <Radio value={"floppy"}>floppy</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    label="Disk Driver-IO"
                                    name="vmDevicesDiskDriverIo"
                                >
                                    <Radio.Group>
                                        <Space>
                                            <Radio value={"native"}>native</Radio>
                                            <Radio value={"threads"}>threads</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    label="Disk Driver-Cache"
                                    name="vmDevicesDiskDriverCache"
                                >
                                    <Select placeholder={"请设置 Disk 磁盘缓存模式"}>
                                        <Option value="default">default</Option>
                                        <Option value="none">none</Option>
                                        <Option value="writethrough">writethrough</Option>
                                        <Option value="writeback">writeback</Option>
                                        <Option value="directsync">directsync</Option>
                                        <Option value="unsafe">unsafe</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Disk Driver-IOThread"
                                    name="vmDevicesDiskDriverIothread"
                                >
                                    <Input placeholder={"请设置 Disk 磁盘 IO 线程"}/>
                                </Form.Item>
                                <Form.Item
                                    label="Disk Driver-Error-Policy"
                                    name="vmDevicesDiskDriverErrorPolicy"
                                >
                                    <Select placeholder={"请设置 Disk IO 写错误处理策略"}>
                                        <Option value="stop">stop</Option>
                                        <Option value="report">report</Option>
                                        <Option value="ignore">ignore</Option>
                                        <Option value="enospace">enospace</Option>
                                        <Option value="retry">retry</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Disk Driver-Rerror-Policy"
                                    name="vmDevicesDiskDriverRerrorPolicy"
                                >
                                    <Select placeholder={"请设置 Disk IO 读错误处理策略"}>
                                        <Option value="stop">stop</Option>
                                        <Option value="report">report</Option>
                                        <Option value="ignore">ignore</Option>
                                        <Option value="enospace">enospace</Option>
                                        <Option value="retry">retry</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Disk Driver-Retry-Interval"
                                    name="vmDevicesDiskDriverRetryInterval"
                                >
                                    <Input placeholder={"请设置 Disk IO 错误重试间隔时间(ms)"} />
                                </Form.Item>
                                <Form.Item
                                    label="Disk Driver-Retry-Timeout"
                                    name="vmDevicesDiskDriverRetryTimeout"
                                >
                                    <Input placeholder={"请设置 Disk IO 错误重试超时时间(ms)"} />
                                </Form.Item>
                                <Form.Item
                                    label="Disk Target-Dev"
                                    name="vmDevicesDiskTargetDev"
                                    initialValue={"vda"}
                                >
                                    <Input placeholder={"请指定磁盘的逻辑设备名称"} defaultValue={"vda"}/>
                                </Form.Item>
                                <Form.Item
                                    label="Disk Target-Bus"
                                    name="vmDevicesDiskTargetBus"
                                    initialValue={"virtio"}
                                >
                                    <Select placeholder={"请指定磁盘设备类型"} defaultValue={"virtio"}>
                                        <Option value="virtio">virtio</Option>
                                        <Option value="scsi">scsi</Option>
                                        <Option value="usb">usb</Option>
                                        <Option value="sata">sata</Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Panel>
                        <Panel header="虚拟机 IOS/CDROM 镜像高级配置" key="3">
                            <Form
                                form={formInstance}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 8 }}
                            >
                                <Form.Item
                                    label="Image Disk Type"
                                    name="vmDevicesDiskImageType"
                                    initialValue={"file"}
                                >
                                    <Select placeholder={"请选择 Image 磁盘设备类型"} defaultValue={"file"}>
                                        <Option value="file">file</Option>
                                        <Option value="block">block</Option>
                                        <Option value="dir">dir</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Image Disk Device"
                                    name="vmDevicesDiskImageDevice"
                                    initialValue={"cdrom"}
                                >
                                    <Radio.Group defaultValue={"cdrom"}>
                                        <Space>
                                            <Radio value={"disk"}>disk</Radio>
                                            <Radio value={"cdrom"}>cdrom</Radio>
                                            <Radio value={"floppy"}>floppy</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    label="Image Target-Dev"
                                    name="vmDevicesDiskImageTargetDev"
                                    initialValue={"sda"}
                                >
                                    <Input placeholder={"请指定 Image 磁盘的逻辑设备名称"} defaultValue={"sda"}/>
                                </Form.Item>
                                <Form.Item
                                    label="Image Target-Bus"
                                    name="vmDevicesDiskImageTargetBus"
                                    initialValue={"scsi"}
                                >
                                    <Select placeholder={"请指定 Image 磁盘设备类型"} defaultValue={"scsi"}>
                                        <Option value="virtio">virtio</Option>
                                        <Option value="scsi">scsi</Option>
                                        <Option value="usb">usb</Option>
                                        <Option value="sata">sata</Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Panel>
                        <Panel header="虚拟机 网卡 高级配置" key="4">
                            <Form
                                form={formInstance}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 8 }}
                            >
                                <Form.Item
                                    label="Interface Model-Type"
                                    name="vmInterfaceModelType"
                                    initialValue={"virtio"}
                                >
                                    <Input placeholder={"请指定 Interface 驱动类型"} defaultValue={"virtio"}/>
                                </Form.Item>
                                <Form.Item
                                    label="Interface Target-Dev"
                                    name="vmInterfaceTargetDev"
                                >
                                    <Input placeholder={"请指定 Interface 虚拟网卡名称"}/>
                                </Form.Item>
                                <Form.Item
                                    label="Interface Source-Bridge"
                                    name="vmInterfaceBridgeSourceBridge"
                                    // initialValue={"br0"}
                                >
                                    <Select placeholder={"(Bridge类型选择) 请选择要桥接的网桥"}>
                                        {tempBridgeList && tempBridgeList.map(bridgeName => (
                                            <Option key={bridgeName}>{bridgeName}</Option>
                                        ))}
                                    </Select>
                                    {/*<Input placeholder={"(Bridge类型填写) 请指定 Interface 网桥名称"} defaultValue={"br0"}/>*/}
                                </Form.Item>
                                <Form.Item
                                    label="Interface Source-Network"
                                    name="vmInterfaceNatSourceNetwork"
                                    initialValue={"default"}
                                >
                                    <Input placeholder={"(NAT类型填写) 请指定 Interface 网桥名称"} defaultValue="default"/>
                                </Form.Item>
                            </Form>
                        </Panel>
                        <Panel header="虚拟机 Graphics VNC 高级配置" key="5">
                            <Form
                                form={formInstance}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 8 }}
                            >
                                <Form.Item
                                    label="Customize the VNC Port"
                                    name="vmGraphicsVncPort"
                                >
                                    <Input placeholder={"默认为空(自动生成) 或 手动指定 VNC 端口"}/>
                                </Form.Item>
                            </Form>
                        </Panel>
                    </Collapse>
                )}
                {current === 3 && (
                    <Row style={{marginTop: 25}} justify={"center"} align={"middle"}>
                        <Col>
                            <ReactJson name={"Virtual_Machine_Params"} src={jsonObject}></ReactJson>
                        </Col>
                    </Row>
                )}
                {current === 4 && resultIndex == 0 && (
                    // 等待
                    <Result style={{marginTop: 80}} title={"虚拟机正在创建中，请耐心等待！" } icon={<SmileOutlined />}></Result>
                )}
                {current === 4 && resultIndex == 1 && (
                    // 成功
                    <Result style={{marginTop: 80}}  status={"success"} title={"虚拟机创建成功，请配置相关信息！"}></Result>
                )}
                {current === 4 && resultIndex == 2 && (
                    // 错误
                    <Result style={{marginTop: 80}}  status={"error"} title={"虚拟机创建失败，请检查错误原因！"}></Result>
                )}

                {/*----------按钮-----------*/}
                {current < 3 && (
                    <Row style={{margin: 50}}>
                        <Col span={9}></Col>
                        <Col span={6}>
                            <Space size={"large"}>
                                <Button type={"default"} shape={"round"} onClick={prev}>上一步</Button>
                                <Button type={"primary"} shape={"round"} onClick={next}>下一步</Button>
                            </Space>
                        </Col>
                        <Col span={9}></Col>
                    </Row>
                )}
                {current === 3 && (
                    <Row style={{margin: 50}}>
                        <Col span={9}></Col>
                        <Col span={6}>
                            <Space size={"large"}>
                                <Button type={"default"} shape={"round"} onClick={prev}>上一步</Button>
                                <Button type={"primary"} shape={"round"} onClick={confirmCreateVm}>确认创建</Button>
                            </Space>
                        </Col>
                        <Col span={9}></Col>
                    </Row>
                )}
            </PageContainer>
        </>
    );
};
export default VmCreatePage;