import {
  apiDeleteBackup,
  apiGetRetentionTime,
  apiGetSystemConfig,
  apiQueryBackup,
  apiReverBackup,
  apiSetBackup,
  apiSetRetentionTime,
  apiSetSystemConfig,
} from '@/api/System';
import {
    apiCreateAuthGroup,
    apiGetAuthGroup,
    apiDeleteAuthGroup,
    apiGetAuthInfo,
    apiCreateAuthInfo,
    apiDeleteAuthInfo,
} from '@/api/User';
import { IssuesCloseOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import {
  Button,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  notification,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

interface DataType {
  key: number;
  value: string;
}

const SystemManagePage: React.FC = () => {
  const backupColumns: ColumnsType<DataType> = [
    {
      title: '权限组ID',
      dataIndex: 'authGroupUuid',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
      fixed: 'left',
    },
    {
      title: '权限组名称',
      dataIndex: 'authGroupName',
      ellipsis: {
        showTitle: false,
      },
      width: 300,
      fixed: 'left',
    },
    {
      title: '权限组描述',
      dataIndex: 'authGroupDescription',
      ellipsis: {
        showTitle: false,
      },
      width: 300,
      render: (backupPath) => (
        <Tooltip placement="topLeft" title={backupPath}>
          {backupPath}
        </Tooltip>
      ),
    },
    {
      title: '权限组用户ID',
      dataIndex: 'authUserUuid',
      ellipsis: {
        showTitle: false,
      },
      width: 300,
      render: (authUserUuid) => (
        <Tooltip placement="topLeft" title={authUserUuid}>
          {authUserUuid}
        </Tooltip>
      ),
    },
    {
      title: '用户权限组创建时间',
      dataIndex: 'authCreateTime',
      ellipsis: {
        showTitle: false,
      },
      width: 300,
      render: (backupTime) => (
        <Tooltip placement="topLeft" title={backupTime}>
          {backupTime}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => apiDeleteAuthInfo(record.authGroupUuid, record.authUserUuid)}
          >
            <Button size={'small'} shape={'round'} danger={true} type="dashed">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const dbColumns: ColumnsType<DataType> = [
    {
      title: '系统配置名',
      dataIndex: 'key',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
      fixed: 'left',
    },
    {
      title: '系统配置值',
      dataIndex: 'value',
      ellipsis: {
        showTitle: false,
      },
      width: 300,
      fixed: 'left',
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          {value}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 50,
      render: (_, record) => (
        <Space>
          <Button
            size={'small'}
            shape={'round'}
            type="dashed"
            onClick={() => apiDeleteAuthGroup(record.backupZzid)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const columns: ColumnsType<DataType> = [
    {
      title: '权限组配置索引',
      dataIndex: 'authGroupZzid',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
      fixed: 'left',
    },
    {
      title: '权限组配置ID',
      dataIndex: 'authGroupUuid',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      fixed: 'left',
    },
    {
      title: '权限组配置名',
      dataIndex: 'authGroupName',
      ellipsis: {
        showTitle: false,
      },
      width: 300,
    },
    {
      title: '权限组配置描述',
      dataIndex: 'authGroupDescription',
      ellipsis: {
        showTitle: false,
      },
      width: 300,
    },
    {
      title: '权限组创建时间',
      dataIndex: 'authGroupCreateTime',
      ellipsis: {
        showTitle: false,
      },
      width: 300,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <>
          {' '}
          <Space>
            <Button
              size={'small'}
              shape={'round'}
              type="danger"
              onClick={() => apiDeleteAuthGroup(record.authGroupUuid)}
            >
              删除
            </Button>
          </Space>
        </>
      ),
    },
  ];

  /**
   * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
   */
  let [data, setData] = useState([]);
  let [selectData, setSelectData] = useState();
  let [addModalOpen, setAddModalOpen] = useState(false);
  let [addModalOpen2, setAddModalOpen2] = useState(false);
  let [updateModalOpen, setUpdateModalOpen] = useState(false);
  let [getDetailOpen, setGetDetailOpen] = useState(false);
  let [addFormInstance] = Form.useForm();
  let [addFormInstance2] = Form.useForm();
  let [updateFormInstance] = Form.useForm();
  let [influxSecond, setInfluxSecond] = useState([{ key: 'db', value: '0' }]);
  let [backupData, setBackupData] = useState([]);
  const [apiNotification, contextHolder] = notification.useNotification();

  // 钩子，启动时获取系统配置列表
  useEffect(() => {
    apiGetAuthGroup().then((resp) => {
      if (resp != null) {
        setData(resp);
      }
    });
    apiGetAuthInfo().then((resp) => {
      if (resp != null) {
        setBackupData(resp);
      }
    });
  }, []);

  /**
   * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
   */
  // 打开详细信息
  const showGetDetailOpen = (hostUuid: String) => {
    const res = data.find((item) => item.key == key);
    console.log('showGetDetailOpen', res);
    setSelectData(res);
    setGetDetailOpen(true);
  };
  // 打开新增系统配置窗口
  const showAddModal = () => {
    addFormInstance.resetFields();
    setAddModalOpen(true);
  };
  const showAddModal2 = () => {
    addFormInstance2.resetFields();
    setAddModalOpen2(true);
  };
  const submitAddModal = () => {
    apiCreateAuthGroup(addFormInstance.getFieldsValue()).then((respCode) => {
      // 如果新增成功，刷新列表
      if (respCode == 200) {
        apiGetAuthGroup().then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
        setAddModalOpen(false);
      }
    });
}
const submitAddModal2 = () => {
    apiCreateAuthInfo(addFormInstance2.getFieldsValue()).then((respCode) => {
      // 如果新增成功，刷新列表
      if (respCode == 200) {
        apiGetAuthInfo().then((resp) => {
          if (resp != null) {
            setBackupData(resp);
          }
        });
        setAddModalOpen2(false);
      }
    });
}
  // 打开修改系统配置信息窗口
  const showUpdateModal = (record: DataType) => {
    setUpdateModalOpen(true);
    updateFormInstance.setFieldsValue({
      key: record.key,
      value: record.value,
    });
  };
  const showSysUpdateModal = (record: DataType) => {
    setUpdateModalOpen(true);
    if (record.key == 'db') {
      updateFormInstance.setFieldsValue({
        key: record.key,
        value: record.value,
      });
    } else {
      updateFormInstance.setFieldsValue({
        key: record.configKey,
        value: record.configValue,
      });
    }
  };
  // 修改系统配置信息
  const submitUpdateModal = () => {
    const temp = updateFormInstance.getFieldsValue();
    if (temp.key == 'db') {
      const data = {
        second: temp.value,
      };
      apiSetRetentionTime(data).then((respCode) => {
        // 如果修改成功刷新列表
        if (respCode == 200) {
          apiGetRetentionTime().then((resp) => {
            if (resp != null) {
              setInfluxSecond(resp);
            }
          });
        }
      });
    } else {
      apiSetSystemConfig(temp.key, temp.value).then((respCode) => {
        // 如果修改成功刷新列表
        if (respCode == 200) {
          apiGetSystemConfig().then((resp) => {
            if (resp != null) {
              setData(resp);
            }
          });
        }
      });
    }
    cancelUpdateModal();
  };
  // 关闭详细信息窗口
  const cancelGetDetail = () => {
    setGetDetailOpen(false);
  };
  // 取消新增系统配置
  const cancelAddModal = () => {
    setAddModalOpen(false);
  };
  const cancelAddModal2 = () => {
    setAddModalOpen2(false);
  }
  // 取消修改系统配置
  const cancelUpdateModal = () => {
    setUpdateModalOpen(false);
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
          title="创建权限组"
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
                  label="权限组名称"
                  name="authGroupName"
                  rules={[{ required: true, message: '请输入名称' }]}
              >
                  <Input placeholder={"test"}/>
              </Form.Item>
              <Form.Item
                  label="权限组描述信息"
                  name="authGroupDescription"
                  rules={[{ required: true, message: '请输入' }]}
              >
                  <Input placeholder={"8"}/>
              </Form.Item>
          </Form>
      </Drawer>

      <Drawer
          title="创建用户权限组"
          width={720}
          open={addModalOpen2}
          onClose={cancelAddModal2}
          destroyOnClose={true}
          bodyStyle={{
                "paddingBottom": 80,
          }}
          extra={
              <Space>
                <Button onClick={cancelAddModal2}>取消</Button>
                <Button onClick={submitAddModal2} type="primary">
                  确认
                </Button>
              </Space>
            }
      >
          <Form
              layout="vertical"
              form={addFormInstance2}
          >
              <Form.Item
                  label="权限组 UUID"
                  name="authGroupUuid"
                  rules={[{ required: true, message: '请输入名称' }]}
              >
                  <Input placeholder={"test"}/>
              </Form.Item>
              <Form.Item
                  label="用户 ID"
                  name="authUserUuid"
                  rules={[{ required: true, message: '请输入' }]}
              >
                  <Input placeholder={"8"}/>
              </Form.Item>
          </Form>
      </Drawer>

      <Drawer
        title="配置修改"
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
            label="系统配置名"
            name="key"
            rules={[{ required: true, message: '请输入系统配置名!' }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            label="系统配置值"
            name="value"
            rules={[{ required: true, message: '请输入系统配置值!' }]}
          >
            <Input placeholder={'xxx'} />
          </Form.Item>
        </Form>
      </Drawer>

      <Space size={'middle'}>
        <Button
          type="primary"
          size="large"
          icon={<RedoOutlined />}
          onClick={() =>
            apiGetAuthGroup().then((resp) => {
              if (resp != null) {
                setData(resp);
              }
            })
          }
        >
          刷新
        </Button>
        <Button
          type="dashed"
          size="large"
          icon={<IssuesCloseOutlined />}
          onClick={showAddModal}
        >
          创建权限组
        </Button>
      </Space>
      <ProDescriptions
        style={{
          paddingTop: 20,
        }}
        title="权限组信息"
        column={2}
        layout="vertical"
      />
      <Table
        style={{ marginTop: 15 }}
        columns={columns}
        dataSource={data}
        rowKey={'key'}
        pagination={false}
        scroll={{ x: 1000 }}
      />

      <ProDescriptions
        style={{
          paddingTop: 20,
        }}
        title="用户权限组信息"
        column={2}
        layout="vertical"
      />
      <Space size={'middle'}>
      <Button
          type="primary"
          size="large"
          icon={<RedoOutlined />}
          onClick={() =>
            apiGetAuthInfo().then((resp) => {
              if (resp != null) {
                setBackupData(resp);
              }
            })
          }
        >
          刷新
        </Button>
        <Button
          type="dashed"
          size="large"
          icon={<IssuesCloseOutlined />}
          onClick={showAddModal2}
        >
          创建用户权限组
        </Button>
      </Space>
      <Table
        style={{ marginTop: 15 }}
        columns={backupColumns}
        dataSource={backupData}
        rowKey={'key'}
        pagination={false}
        scroll={{ x: 1000 }}
      />
    </PageContainer>
  );
};
export default SystemManagePage;
