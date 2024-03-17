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
    apiInsertAllEvaluateNode,
    apiGetAllEvaluateNode,
    apiDeleteEvaluateNode,
    apiUpdateEvaluateNode,
    apiInsertEvaluateNode,
} from '@/api/PluginNode';
import { apiStartHostMonitor, apiStopHostMonitor } from '@/api/Monitor';
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import {
  Button,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Radio,
  Tag,
  Tooltip,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';

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

const HostManagePage: React.FC = () => {
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
        title: '节点ID',
        dataIndex: 'nodeId',
        ellipsis: {
            showTitle: false,
        },
        width: 100,
    },
    {
        title: '节点名称',
        dataIndex: 'nodeName',
        ellipsis: {
            showTitle: false,
        },
        width: 150,
    },
    {
        title: '节点描述',
        dataIndex: 'nodeDescription',
        ellipsis: {
            showTitle: false,
        },
        width: 150,
    },
    {
        title: '节点类型',
        dataIndex: 'nodeType',
        ellipsis: {
            showTitle: false,
        },
        width: 100,
    },
    {
        title: '节点IP',
        dataIndex: 'nodeIp',
        ellipsis: {
            showTitle: false,
        },
        width: 150,
    },
    {
        title: '节点端口',
        dataIndex: 'nodePort',
        ellipsis: {
            showTitle: false,
        },
        width: 100,
    },
    {
        title: '节点用户名',
        dataIndex: 'nodeUsername',
        ellipsis: {
            showTitle: false,
        },
        width: 150,
    },
    {
        title: '节点密码',
        dataIndex: 'nodePassword',
        ellipsis: {
            showTitle: false,
        },
        width: 150,
    },
    {
        title: '创建时间',
        dataIndex: 'nodeCreateTime',
        ellipsis: {
            showTitle: false,
        },
        width: 200,
    },
    {
        title: '添加类型',
        dataIndex: 'nodeAddType',
        ellipsis: {
            showTitle: false,
        },
        width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
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
            onConfirm={() => deleteHost(record.nodeId)}
          >
            <Button size={'small'} shape={'round'} danger={true} type="dashed">
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

  // 钩子，启动时获取测试节点列表
  useEffect(() => {
    apiGetAllEvaluateNode().then((resp) => {
      if (resp != null) {
        setData(resp);
      }
    });
  }, []);

  /**
   * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
   */
  // 打开详细信息
  const showGetDetailOpen = (hostUuid: String) => {
    const res = data.find((item) => item.hostUuid == hostUuid);
    console.log('showGetDetailOpen', res);
    setSelectData(res);
    setGetDetailOpen(true);
  };
  // 打开新增测试节点窗口
  const showAddModal = () => {
    addFormInstance.resetFields();
    setAddModalOpen(true);
  };
  // 打开修改测试节点信息窗口
  const showUpdateModal = (record: DataType) => {
    setUpdateModalOpen(true);
    updateFormInstance.setFieldsValue({
        nodeId: record.nodeId,
        nodeName: record.nodeName,
        nodeDescription: record.nodeDescription,
        nodeIp: record.nodeIp,
        nodePort: record.nodePort,
        nodeUsername: record.nodeUsername,
        nodePassword: record.nodePassword,
        nodeType: record.nodeType == "宿主机" ? 1 : 2,
    });
  };
  // 新增测试节点
  const submitAddModal = () => {
    apiAddHost(addFormInstance.getFieldsValue()).then((respCode) => {
      // 如果新增成功，刷新列表
      if (respCode == 200) {
        apiGetAllEvaluateNode().then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
    setAddModalOpen(false);
  };
  // 修改测试节点信息
  const submitUpdateModal = () => {
    const temp = updateFormInstance.getFieldsValue();
    // 转换为int
    temp.nodeId = parseInt(temp.nodeId);
    apiUpdateEvaluateNode(temp).then((respCode) => {
      // 如果修改成功刷新列表
      if (respCode == 200) {
        apiGetAllEvaluateNode().then((resp) => {
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
  // 取消新增测试节点
  const cancelAddModal = () => {
    setAddModalOpen(false);
  };
  // 取消修改测试节点
  const cancelUpdateModal = () => {
    setUpdateModalOpen(false);
  };
  // 删除测试节点
  const deleteHost = (hostId: string) => {
    // hostId转数组
    let hostIds = [hostId];
    apiDeleteEvaluateNode(hostIds).then((respCode) => {
      // 如果测试节点删除成功，刷新列表
      if (respCode == 200) {
        apiGetAllEvaluateNode().then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
  };
  // 启用测试节点
  const startHost = (hostId: string) => {
    apiStartHost(hostId).then((respCode) => {
      if (respCode == 200) {
        apiGetAllEvaluateNode().then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
  };
  // 停用测试节点
  const stopHost = (hostId: string) => {
    apiStopHost(hostId).then((respCode) => {
      if (respCode == 200) {
        apiGetAllEvaluateNode().then((resp) => {
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
        title="新增测试节点"
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
                label="测试节点描述"
                name="nodeDescription"
                rules={[{ required: true, message: '请输入测试节点描述!' }]}
            >
                <Input.TextArea
                    showCount={true}
                    placeholder={'最大长度为 500 个字符'}
                />
            </Form.Item>
            <Form.Item
                label="测试节点IP"
                name="nodeIp"
                rules={[{ required: true, message: '请输入测试节点 IP!' }]}
            >
                <Input placeholder={'示例: 192.168.0.1'} />
            </Form.Item>
            <Form.Item
                label="测试节点名称"
                name="nodeName"
                rules={[{ required: true, message: '请输入测试节点名称!' }]}
            >
                <Input placeholder={'长度不超过 32 个字符'} />
            </Form.Item>
            <Form.Item
                label="测试节点密码"
                name="nodePassword"
                rules={[{ required: true, message: '请输入测试节点密码!' }]}
            >
                <Input.Password placeholder={'示例: 1234'} />
            </Form.Item>
            <Form.Item
                label="测试节点端口"
                name="nodePort"
                rules={[{ required: true, message: '请输入测试节点端口!' }]}
            >
                <Input placeholder={'示例: 22'} />
            </Form.Item>
            <Form.Item
                label="测试节点类型"
                name="nodeType"
                rules={[{ required: true, message: '请输入测试节点类型!' }]}
            >
                <Radio.Group>
                    <Radio value={1}>物理节点</Radio>
                    <Radio value={2}>虚拟节点</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label="测试节点用户名"
                name="nodeUsername"
                rules={[{ required: true, message: '请输入测试节点用户名!' }]}
            >
                <Input placeholder={'示例: root'} />
            </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="测试节点信息修改"
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
            label="测试节点ID"
            name="nodeId"
            rules={[{ required: true, message: '请输入测试节点ID!' }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
                label="测试节点描述"
                name="nodeDescription"
                rules={[{ required: true, message: '请输入测试节点描述!' }]}
            >
                <Input.TextArea
                    showCount={true}
                    placeholder={'最大长度为 500 个字符'}
                />
            </Form.Item>
            <Form.Item
                label="测试节点IP"
                name="nodeIp"
                rules={[{ required: true, message: '请输入测试节点 IP!' }]}
            >
                <Input placeholder={'示例: 192.168.0.1'} />
            </Form.Item>
            <Form.Item
                label="测试节点名称"
                name="nodeName"
                rules={[{ required: true, message: '请输入测试节点名称!' }]}
            >
                <Input placeholder={'长度不超过 32 个字符'} />
            </Form.Item>
            <Form.Item
                label="测试节点密码"
                name="nodePassword"
                rules={[{ required: true, message: '请输入测试节点密码!' }]}
            >
                <Input.Password placeholder={'示例: 1234'} />
            </Form.Item>
            <Form.Item
                label="测试节点端口"
                name="nodePort"
                rules={[{ required: true, message: '请输入测试节点端口!' }]}
            >
                <Input placeholder={'示例: 22'} />
            </Form.Item>
            <Form.Item
                label="测试节点类型"
                name="nodeType"
                rules={[{ required: true, message: '请输入测试节点类型!' }]}
            >
                <Radio.Group>
                    <Radio value={1}>物理节点</Radio>
                    <Radio value={2}>虚拟节点</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label="测试节点用户名"
                name="nodeUsername"
                rules={[{ required: true, message: '请输入测试节点用户名!' }]}
            >
                <Input placeholder={'示例: root'} />
            </Form.Item>
        </Form>
      </Drawer>

      <Space size={'middle'}>
        <Button
          type="primary"
          size="large"
          icon={<RedoOutlined />}
          onClick={() =>
            apiGetAllEvaluateNode().then((resp) => {
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
          新增测试节点
        </Button>
        <Button
          type="dashed"
          size="large"
          icon={<PlayCircleOutlined />}
          onClick={() =>
            apiInsertAllEvaluateNode(selectedRowKeys).then((resp) => {
              if (resp != null) {
                console.log('apiInsertAllEvaluateNode');
                apiGetAllEvaluateNode().then((resp) => {
                    if (resp != null) {
                        setData(resp);
                    }
                });
              }
            })
          }
        >
          一键导入云主机
        </Button>
      </Space>
      <Table
        style={{ marginTop: 15 }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey={'hostUuid'}
        scroll={{ x: 1000 }}
      ></Table>
    </PageContainer>
  );
};
export default HostManagePage;
