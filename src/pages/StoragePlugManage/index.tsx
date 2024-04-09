import {
  apiAddHost,
  apiDeleteHost,
  apiRefreshHostList,
  apiStartHost,
  apiStopHost,
  apiUpdateHost,
  apiUpdateHostSSH,
} from '@/api/HostManage';
import {
    apiGetPlugCardList,
    apiUpdatePlugCard,
    apiDeletePlugCard,
    apiAddPlugCard,
} from '@/api/Plugin';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import {
  Button,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import PlugInfoPage from './components/PlugInfo';

interface DataType {
  hostZzid: number;
  hostUuid: string;
  hostName: string;
  hostDescription: string;
  hostIp: string;
  hostSshPort: string;
  hostLoginUser: string;
  hostLoginPassword: string;
  hostEnable: number;
  hostCreateTime: unknown;
}

const PluginManagePage: React.FC = () => {
  useEffect(() => {
    const random = Math.random().toString(36).slice(-8);
    const websocket_recommend = new WebSocket(
      'ws://' +
        window.location.hostname +
        ':28080/api/websocket/resource/' +
        random,
    );
    websocket_recommend.onopen = function () {
      console.log('websocket open');
    };
    websocket_recommend.onmessage = function (msg) {
      console.log(
        'ws://' + window.location.hostname + ':28080/api/websocket/resource/',
        msg.data,
      );
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
      title: 'ID',
      dataIndex: 'cardZzid',
      ellipsis: {
        showTitle: false,
      },
      width: 50,
      fixed: 'left',
      render: (cardZzid) => (
        <Tooltip placement="topLeft" title={cardZzid}>
            <a
                onClick={(event) => {
                event.preventDefault();
                showGetDetailOpen(cardZzid);
                }}
            >
                {cardZzid}
            </a>
        </Tooltip>
      ),
    },
    {
      title: '标签',
      dataIndex: 'cardTag',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      fixed: 'left',
      render: (cardTag) => (
        <Tooltip placement="topLeft" title={cardTag}>
          {/* <a onClick={(event) => {event.preventDefault();history.push("/system/monitor?uuid=" + hostId)}}> */}
            {cardTag}
        </Tooltip>
      ),
    },
    {
      title: '名称',
      dataIndex: 'cardName',
      ellipsis: {
        showTitle: false,
      },
      render: (cardName) => (
        <Tooltip placement="topLeft" title={cardName}>
          {cardName}
        </Tooltip>
      ),
      width: 130,
    },
    {
      title: '描述信息',
      dataIndex: 'cardDescription',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      render: (cardDescription) => (
        <Tooltip placement="topLeft" title={cardDescription}>
          {cardDescription == null ? '无' : cardDescription}
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'cardCreateTime',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      render: (cardCreateTime) => (
        <Tooltip placement="topLeft" title={cardCreateTime}>
          {cardCreateTime}
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'cardEnable',
      ellipsis: {
        showTitle: false,
      },
      width: 100,
      render: (cardEnable) => (
        <>
          {cardEnable == 0 ? (
            <Tag color="blue" key={cardEnable}>
              启用
            </Tag>
          ) : (
            <Tag color="volcano" key={cardEnable}>
              禁用
            </Tag>
          )}
        </>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          {/* 查看详细信息 */}
          <Button
            size={'small'}
            shape={'round'}
            type="dashed"
            onClick={(event) => {
              event.preventDefault();
              showGetDetailOpen(record.cardZzid);
              }}
          >
            查看
          </Button>

          <Button
            size={'small'}
            shape={'round'}
            type="dashed"
            onClick={() => showUpdateModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deleteHost(record.cardZzid)}
          >
            <Button size={'small'} shape={'round'} danger={true} type="dashed">
              删除
            </Button>
          </Popconfirm>
          {/* <Popconfirm
            title="Sure to star?"
            onConfirm={() => startHost(record.cardZzid)}
          >
            <Button size={'small'} shape={'round'} danger={true} type="dashed">
              启用(O)
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Sure to stop?"
            onConfirm={() => stopHost(record.cardZzid)}
          >
            <Button size={'small'} shape={'round'} danger={true} type="dashed">
              停用(0)
            </Button>
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  const detailColumn = [
    {
      title: 'ID',
      dataIndex: 'hostZzid',
      ellipsis: {
        showTitle: false,
      },
      width: 50,
      fixed: 'left',
    },
    {
      title: 'UUID',
      dataIndex: 'hostUuid',
      key: 'hostUuid',
      ellipsis: {
        showTitle: false,
      },
      width: 300,
      fixed: 'left',
      render: (hostUuid) => (
        <a
          onClick={(event) => {
            event.preventDefault();
            history.push('/system/monitor?uuid=' + hostUuid);
          }}
        >
          {hostUuid}
        </a>
      ),
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
      width: 130,
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
      width: 140,
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
      ),
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
      ),
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
          {hostDescription == null ? '无' : hostDescription}
        </Tooltip>
      ),
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
      ),
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
      ),
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
      ),
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
      ),
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
      ),
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
      ),
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
      ),
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
      ),
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
      ),
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
      ),
    },
    {
      title: '状态',
      dataIndex: 'hostState',
      ellipsis: {
        showTitle: false,
      },
      width: 100,
      render: (hostState) => <>{(hostState = 'enable' ? '启用' : '禁用')}</>,
    },
    {
      title: '监控',
      dataIndex: 'hostUuid',
      key: 'hostUuid',
      ellipsis: {
        showTitle: false,
      },
      width: 300,
      fixed: 'left',
      render: (hostUuid, record) => (
        <a
          onClick={(event) => {
            console.log(hostUuid.props.children);
            event.preventDefault();
            history.push(
              `/system/monitor?uuid=${hostUuid.props.children}&ipmi=${record.hostIpmiAddr}&snmp=${record.hostSnmpAddr}`,
            );
          }}
        >
          查看监控
        </a>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 155,
      render: (_, record) => (
        <Space>
          <Button
            size={'large'}
            type="dashed"
            onClick={() => showUpdateModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deleteHost(record.hostUuid)}
          >
            <Button size={'large'} danger={true} type="dashed">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /**
   * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
   */
  let [data, setData] = useState([]);
  let [selectData, setSelectData] = useState();
  let [addModalOpen, setAddModalOpen] = useState(false);
  let [updateModalOpen, setUpdateModalOpen] = useState(false);
  let [getDetailOpen, setGetDetailOpen] = useState(false);
  let [addFormInstance] = Form.useForm();
  let [updateFormInstance] = Form.useForm();
  const [apiNotification, contextHolder] = notification.useNotification();

  // 钩子，启动时获取插件列表
  useEffect(() => {
    apiGetPlugCardList(1).then((resp) => {
      if (resp != null) {
        setData(resp);
      }
    });
  }, []);

  /**
   * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
   */
  // 打开详细信息
  const showGetDetailOpen = (cardZzid: String) => {
    const res = data.find((item) => item.cardZzid == cardZzid);
    console.log('showGetDetailOpen', res);
    setSelectData(res);
    setGetDetailOpen(true);
  };
  // 打开新增插件窗口
  const showAddModal = () => {
    addFormInstance.resetFields();
    setAddModalOpen(true);
  };
  // 打开修改插件信息窗口
  const showUpdateModal = (record: DataType) => {
    setUpdateModalOpen(true);
    updateFormInstance.setFieldsValue({
        cardZzid: record.cardZzid,
        cardName: record.cardName,
        cardDescription: record.cardDescription,
    });
  };
  // 新增插件
  const submitAddModal = () => {
    let temp = addFormInstance.getFieldsValue();
    temp.cardType = 1;
    apiAddPlugCard(temp).then((respCode) => {
      // 如果新增成功，刷新列表
      if (respCode == 200) {
        apiGetPlugCardList(1).then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
    setAddModalOpen(false);
  };
  // 修改插件信息
  const submitUpdateModal = () => {
    const temp = updateFormInstance.getFieldsValue();
    const basicData = {
      hostUuid: temp.hostUuid,
      hostName: temp.hostName,
      hostDescription: temp.hostDescription,
      hostIpmiAddr: temp.hostIpmiAddr,
      hostSnmpAddr: temp.hostSnmpAddr,
    };
    const sshData = {
      hostUuid: temp.hostUuid,
      password: temp.hostLoginPassword,
      sshPort: temp.hostSshPort,
      username: temp.hostLoginUser,
    };

    apiUpdateHost(basicData).then((respCode) => {
      // 如果修改成功刷新列表
      if (respCode == 200) {
        apiGetPlugCardList(1).then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
    apiUpdateHostSSH(sshData).then((respCode) => {
      // 如果修改成功刷新列表
      if (respCode == 200) {
        apiGetPlugCardList(1).then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
  };
  // 关闭详细信息窗口
  const cancelGetDetail = () => {
    setGetDetailOpen(false);
  };
  // 取消新增插件
  const cancelAddModal = () => {
    setAddModalOpen(false);
  };
  // 取消修改插件
  const cancelUpdateModal = () => {
    setUpdateModalOpen(false);
  };
  // 删除插件
  const deleteHost = (hostId: string) => {
    apiDeletePlugCard(hostId).then((respCode) => {
      // 如果插件删除成功，刷新列表
      if (respCode == 200) {
        apiGetPlugCardList(1).then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
  };
  // 启用插件
  const startHost = (hostId: string) => {
    apiStartHost(hostId).then((respCode) => {
      if (respCode == 200) {
        apiGetPlugCardList(1).then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
  };
  // 停用插件
  const stopHost = (hostId: string) => {
    apiStopHost(hostId).then((respCode) => {
      if (respCode == 200) {
        apiGetPlugCardList(1).then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
  };

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
        title="新增插件"
        width={720}
        open={addModalOpen}
        onClose={cancelAddModal}
        destroyOnClose={true}
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
        <Form layout="vertical" form={addFormInstance}>
          <Form.Item
            label="插件描述"
            name="cardDescription"
            rules={[{ required: true, message: '请输入集群UUID' }]}
          >
            <Input placeholder={'xxxxxxxxxxx'} />
          </Form.Item>
          <Form.Item
            label="插件名称"
            name="cardName"
            rules={[{ required: true, message: '请输入插件名称!' }]}
          >
            <Input placeholder={'长度不超过 32 个字符'} />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="插件信息修改"
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
            label="插件ID"
            name="cardZzid"
            rules={[{ required: true, message: '请输入插件ID!' }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            label="插件名称"
            name="cardName"
            rules={[{ required: true, message: '请输入插件名称!' }]}
          >
            <Input placeholder={'长度不超过 32 个字符'} />
          </Form.Item>

          <Form.Item
            label="插件描述"
            name="cardDescription"
            rules={[{ required: true, message: '请输入插件 IP!' }]}
          >
            <Input placeholder={'示例: 192.168.0.1'} />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="插件详细信息"
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
          title="历史版本"
          column={2}
          layout="vertical"
        />

        <PlugInfoPage key={selectData?.cardZzid} uuid={selectData?.cardZzid} />
      </Drawer>

      <Space size={'middle'}>
        <Button
          type="primary"
          size="large"
          icon={<RedoOutlined />}
          onClick={() =>
            apiGetPlugCardList(1).then((resp) => {
              if (resp != null) {
                setData(resp);
              }
            })
          }
        >
          刷新
        </Button>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={showAddModal}
        >
          新增插件
        </Button>
      </Space>
      <Table
        style={{ marginTop: 15 }}
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey={'hostUuid'}
        scroll={{ x: 1000 }}
      ></Table>
    </PageContainer>
  );
};
export default PluginManagePage;
