import React, {useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {Button, Popconfirm, Space, Table, Tooltip} from "antd";
import {ColumnsType} from "antd/es/table";
import {apiRefreshHostList} from "@/api/HostManage";
import {apiQueryVmList} from "@/api/VmManage";

interface DataType {
    vmZzid: string,
    vmHostId: string,
    vmType: string,
    vmCreateForm: string,
    vmId: string,
    vmName: string,
    vmDescription: string,
    vmState: string,
    vmCpus: string,
    vmMemory: string,
    vmMemoryMax: string,
    vmMemoryCurrent: string,
    vmOsType: string,
    vmOsTypeArch: string,
    vmOsTypeMachine: string,
    vmCpuMode: string,
    vmCpuModelFallback: string,
    vmCpuModelValue: string,
    vmCpuVendorid: string,
    vmCpuTopologySocket: string,
    vmCpuTopologyDies: string,
    vmCpuTopologyCores: string,
    vmCpuTopologyThreads: string,
    vmCpuFeaturePolicy: string,
    vmCpuFeatureName: string,
    vmDevicesDiskType: string,
    vmDevicesDiskDevice: string,
    vmDevicesDiskDriverType: string,
    vmDevicesDiskDriverIo: string,
    vmDevicesDiskDriverCache: string,
    vmDevicesDiskDriverIothread: string,
    vmDevicesDiskDriverErrorPolicy: string,
    vmDevicesDiskDriverRerrorPolicy: string,
    vmDevicesDiskDriverRetryInterval: string,
    vmDevicesDiskDriverRetryTimeout: string,
    vmDevicesDiskSourcepath: string,
    vmDevicesDiskTargetDev: string,
    vmDevicesDiskTargetBus: string,
    vmDevicesDiskBootOrder: string,
    vmDevicesDiskSize: string,
    vmDevicesDiskImageType: string,
    vmDevicesDiskImageDevice: string,
    vmDevicesDiskImageSourcepath: string,
    vmDevicesDiskImageTargetDev: string,
    vmDevicesDiskImageTargetBus: string,
    vmDevicesDiskImageBootOrder: string,
    vmDevicesDiskImageReadonly: string,
    vmThvCpu: string,
    vmThvMemory: string,
    vmThvDisk: string,
    vmInterfaceType: string,
    vmInterfaceMacAddress: string,
    vmInterfaceModelType: string,
    vmInterfaceTargetDev: string,
    vmInterfaceBandwidthInboundAverage: string,
    vmInterfaceBandwidthOutboundAverage: string,
    vmInterfaceBridgeSourceBridge: string,
    vmInterfaceBridgeBootOrder: string,
    vmInterfaceNatSourceNetwork: string,
    vmInterfaceNatBootOrder: string,
    vmGraphicsVncPort: string,
    vmEnable: number,
    vmCreateTime: string,
    vmXml: string
}


const VmManagePage: React.FC = () => {

    const columns: ColumnsType<DataType> = [
        {
            title: 'UUID',
            dataIndex: 'vmId',
            ellipsis: {
                showTitle: false,
            },
            render: (vmId) => (
                <Tooltip placement="topLeft" title={vmId}>
                    {vmId}
                </Tooltip>
            ),
            fixed: "left",
            width: 100
        },
        {
            title: '名称',
            dataIndex: 'vmName',
            ellipsis: {
                showTitle: false,
            },
            render: (vmName) => (
                <Tooltip placement="topLeft" title={vmName}>
                    {vmName}
                </Tooltip>
            ),
            width: 120
        },
        {
            title: '宿主机ID',
            dataIndex: 'vmHostId',
            ellipsis: {
                showTitle: false,
            },
            render: (vmHostId) => (
                <Tooltip placement="topLeft" title={vmHostId}>
                    {vmHostId}
                </Tooltip>
            ),
            width: 100
        },
        {
            title: 'CPU数量',
            dataIndex: 'vmCpus',
            ellipsis: {
                showTitle: false,
            },
            width: 90,
            render: (vmCpus) => (
                <Tooltip placement="topLeft" title={vmCpus}>
                    {vmCpus}
                </Tooltip>
            )
        },
        {
            title: '内存(MB)',
            dataIndex: 'vmMemory',
            ellipsis: {
                showTitle: false,
            },
            render: (vmMemory) => (
                <Tooltip placement="topLeft" title={vmMemory}>
                    {vmMemory}
                </Tooltip>
            )
        },
        {
            title: 'CPU-THV',
            dataIndex: 'vmThvCpu',
            ellipsis: {
                showTitle: false,
            },
            render: (vmThvCpu) => (
                <Tooltip placement="topLeft" title={vmThvCpu}>
                    {vmThvCpu}
                </Tooltip>
            )
        },
        {
            title: '内存-THV',
            dataIndex: 'vmThvMemory',
            ellipsis: {
                showTitle: false,
            },
            render: (vmThvMemory) => (
                <Tooltip placement="topLeft" title={vmThvMemory}>
                    {vmThvMemory}
                </Tooltip>
            )
        },
        {
            title: '磁盘-THV',
            dataIndex: 'vmThvDisk',
            ellipsis: {
                showTitle: false,
            },
            render: (vmThvDisk) => (
                <Tooltip placement="topLeft" title={vmThvDisk}>
                    {vmThvDisk}
                </Tooltip>
            )
        },
        {
            title: '磁盘(GB)',
            dataIndex: 'vmDevicesDiskSize',
            ellipsis: {
                showTitle: false,
            },
            render: (vmDevicesDiskSize) => (
                <Tooltip placement="topLeft" title={vmDevicesDiskSize}>
                    {vmDevicesDiskSize}
                </Tooltip>
            )
        },
        {
            title: '映像路径',
            dataIndex: 'vmDevicesDiskSourcepath',
            ellipsis: {
                showTitle: false,
            },
            width: 300,
            render: (vmDevicesDiskSourcepath) => (
                <Tooltip placement="topLeft" title={vmDevicesDiskSourcepath}>
                    {vmDevicesDiskSourcepath}
                </Tooltip>
            )
        },
        {
            title: '描述信息',
            dataIndex: 'vmDescription',
            ellipsis: {
                showTitle: false,
            },
            width: 130,
            render: (vmDescription) => (
                <Tooltip placement="topLeft" title={vmDescription}>
                    {vmDescription}
                </Tooltip>
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 280,
            render: (_, record) =>
                <Space>
                    <Button size={"small"} shape={"round"} type="primary">详情</Button>
                    <Button size={"small"} shape={"round"} type="dashed">修改</Button>
                    <Button size={"small"} shape={"round"} type="dashed">迁移</Button>
                    <Popconfirm title="Sure to delete?">
                        <Button size={"small"} shape={"round"} danger={true} type={"ghost"}>删除</Button>
                    </Popconfirm>
                </Space>
        }
    ];

    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    let [data, setData] = useState([]);

    // 钩子，启动时获取虚拟机列表
    useEffect(() => {
        apiQueryVmList().then(resp => {
            if (resp != null) {
                setData(resp);
            }
        })
    }, [])


    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */




    /**
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    return (
        <PageContainer>
            <Button shape={"round"} type="primary"
                    onClick={() => apiQueryVmList().then(resp => {
                        if (resp != null) {
                            setData(resp);
                        }})}>
                刷新
            </Button>
            <Table style={{marginTop: 8}} columns={columns} dataSource={data} scroll={{x: 1600}} rowKey={"vmId"}></Table>
        </PageContainer>
    );
};
export default VmManagePage;