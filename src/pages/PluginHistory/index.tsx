import {
    apiDeletePlugParam,
    apiGetPlugParamByPlugId,
    apiAddPlugParam,
    apiStartPlugState,
    apiGetPlugExecRecord,
} from '@/api/Plugin';
import React, {useState, useEffect} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Form, Drawer, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag, notification} from "antd";
import { ProDescriptions } from '@ant-design/pro-components';
import {ColumnsType} from "antd/es/table";
import {apiAddHost, apiDeleteHost, apiRefreshHostList, apiUpdateHost, apiUpdateHostSSH, apiStartHost, apiStopHost } from "@/api/HostManage";
import {apiStartHostMonitor, apiStopHostMonitor} from "@/api/Monitor";
import { history } from 'umi';
import { RedoOutlined, PlusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useSearchParams } from '@umijs/max';
import ParamInfoPage from './components/ResultInfo';

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

const PluginHistoryPage: React.FC = () => {
    const [UUID, setUUID] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {      
        const random = Math.random().toString(36).slice(-8);
        const websocket_recommend = new WebSocket(
          'ws://' + window.location.hostname + ':28080/api/websocket/resource/' +
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
            title: '插件ID',
            dataIndex: 'recordPlugId',
            ellipsis: {
                showTitle: false,
            },
            width: 100,
            fixed: "left",
        },
        {
            title: '记录ID',
            dataIndex: 'recordId',
            ellipsis: {
                showTitle: false,
            },
            width: 220,
            fixed: "left",
            render: (recordId) => (
                <Tooltip placement="topLeft" title={recordId}>
                    <a onClick={(event) =>  {event.preventDefault();showGetDetailOpen(recordId)}}>
                        {recordId}
                    </a>
                </Tooltip>
            )
        },
        {
            title: '虚拟机列表',
            dataIndex: 'recordVmList',
            ellipsis: {
                showTitle: false,
            },
            render: (recordVmList) => (
                <Tooltip placement="topLeft" title={recordVmList}>
                    {recordVmList}
                </Tooltip>
            ),
            width: 130
        },
        {
            title: '宿主机列表',
            dataIndex: 'recordHostList',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (recordHostList) => (
                <Tooltip placement="topLeft" title={recordHostList}>
                    {recordHostList}
                </Tooltip>
            )
        },
        {
            title: '执行脚本',
            dataIndex: 'recordExecCommand',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (recordExecCommand) => (
                <Tooltip placement="topLeft" title={recordExecCommand}>
                    {recordExecCommand}
                </Tooltip>
            )
        },
        {
            title: '执行参数',
            dataIndex: 'recordExecParams',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (recordExecParams) => (
                <Tooltip placement="topLeft" title={recordExecParams}>
                    {recordExecParams == null ? "无" : recordExecParams}
                </Tooltip>
            )
        },
        {
            title: '执行次数',
            dataIndex: 'recordExecNumber',
            ellipsis: {
                showTitle: false,
            },
            width: 200,
            render: (recordExecNumber) => (
                <Tooltip placement="topLeft" title={recordExecNumber}>
                    {recordExecNumber}
                </Tooltip>
            )
        },
        {
            title: '执行使能',
            dataIndex: 'recordEnable',
            ellipsis: {
                showTitle: false,
            },
            width: 100,
            render: (recordEnable) => (
                <>
                    {recordEnable=="0" ? (
                        <Tag color="blue" key={recordEnable}>
                            启用
                        </Tag>
                    ) : (
                        <Tag color="volcano" key={recordEnable}>
                            禁用
                        </Tag>
                    )}
                </>
            )
        },
        {
            title: '执行时间',
            dataIndex: 'recordCreateTime',
            fixed: 'right',
            width: 300,
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
                    <a onClick={(event) => {event.preventDefault();history.push("/system/monitor?uuid=" + hostUuid)}}>
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
                    history.push(`/system/monitor?uuid=${hostUuid.props.children}&ipmi=${record.hostIpmiAddr}&snmp=${record.hostSnmpAddr}`);
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

    // 钩子，启动时获取插件列表
    useEffect(() => {
        const uuid = searchParams.get('plugId') || '';
        console.log("PluginRun UUID:", uuid)
        setUUID(uuid);
        apiGetPlugExecRecord(uuid).then(resp => {
            if (resp != null) {
                // // filter data recordId to string
                // resp.forEach((item: any) => {
                //     item.recordId = item.recordId.toString();
                // });
                console.log("PluginRun Data:", resp)
                setData(resp);
            }
        })
    }, [])

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */
    // 打开详细信息
    const showGetDetailOpen = (recordId: String) => {
        const res = data.find(item => item.recordId == recordId)
        console.log("showGetDetailOpen", res)
        setSelectData(res);
        setGetDetailOpen(true);
    }
    // 打开新增插件窗口
    const showAddModal = () => {
        addFormInstance.resetFields();
        setAddModalOpen(true);
    }
    // 打开修改插件信息窗口
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
    // 新增插件
    const submitAddModal = () => {
        apiAddHost(addFormInstance.getFieldsValue()).then(respCode => {
            // 如果新增成功，刷新列表
            if (respCode == 200) {
                apiGetPlugExecRecord(UUID).then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
        setAddModalOpen(false);
    }
    // 修改插件信息
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
                apiGetPlugExecRecord(UUID).then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
        apiUpdateHostSSH(sshData).then(respCode => {
            // 如果修改成功刷新列表
            if (respCode == 200) {
                apiGetPlugExecRecord(UUID).then(resp => {
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
    // 取消新增插件
    const cancelAddModal = () => {
        setAddModalOpen(false);
    }
    // 取消修改插件
    const cancelUpdateModal = () => {
        setUpdateModalOpen(false);
    }
    // 删除插件
    const deleteHost = (hostId: string) => {
        apiDeleteHost(hostId).then(respCode => {
            // 如果插件删除成功，刷新列表
            if (respCode == 200) {
                apiGetPlugExecRecord(UUID).then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
    }
    // 启用插件
    const startHost = (hostId: string) => {
        apiStartHost(hostId).then(respCode => {
            if (respCode == 200) {
                apiGetPlugExecRecord(UUID).then(resp => {
                    if (resp != null) {
                        setData(resp);
                    }
                })
            }
        })
    }
    // 停用插件
    const stopHost = (hostId: string) => {
        apiStopHost(hostId).then(respCode => {
            if (respCode == 200) {
                apiGetPlugExecRecord(UUID).then(resp => {
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
                title="运行结果"
                open={getDetailOpen}
                onClose={cancelGetDetail}
                width={1200}
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
                <ProDescriptions
                title="结果列表"
                column={2}
                layout="vertical"
                />

                {/* <ParamInfoPage key={selectData?.recordId} uuid={"1764552466801758208"} /> */}
                <ParamInfoPage key={selectData?.recordId} uuid={selectData?.recordId} />
            </Drawer>
            <Space size={"middle"}>
                <Button type="primary"
                        size="large"
                        icon={<RedoOutlined />}
                        onClick={() => apiGetPlugExecRecord(UUID).then(resp => {
                            if (resp != null) {
                                setData(resp);
                            }})}>
                    刷新
                </Button>
            </Space>
            <Table style={{marginTop: 15}}
                    // rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
                    rowKey={"recordId"}
                    scroll={{x: 1000}}>
            </Table>
        </PageContainer>
    );
};
export default PluginHistoryPage;