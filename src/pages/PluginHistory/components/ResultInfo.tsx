import {
  apiDeletePlugParam,
  apiAddPlugParam,
  apiGetPlugState,
} from '@/api/Plugin';
import { apiSnapshotDelete, apiSnapshotRevert } from '@/api/VmSnapshot';
import { InboxOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import {
  Button,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Radio,
  Space,
  Table,
  Tooltip,
  Upload,
  message,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import PlugFiles from './PlugFiles';

interface DataType {
  snapGroupUuid: string;
  snapGroupName: string;
}

interface HostIdProps {
  uuid: string;
}
const ParamInfoPage: React.FC<HostIdProps> = (props) => {
  const UUID = props.uuid;
  console.log('UUID', UUID);
  const columns: ColumnsType<DataType> = [
    {
      title: '状态ID',
      dataIndex: 'stateId',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
      render: (stateId) => (
        <Tooltip placement="topLeft" title={stateId}>
            <a
                onClick={(event) => {
                event.preventDefault();
                showGetDetailOpen(stateId);
                }}
            >
                {stateId}
            </a>
        </Tooltip>
      ),
    },
    {
      title: '执行类型',
      dataIndex: 'stateExecType',
      ellipsis: {
        showTitle: false,
      },
      width: 100,
    },
    {
      title: '执行UUID',
      dataIndex: 'stateExecUuid',
      ellipsis: {
        showTitle: false,
      },
      width: 400,
    },
    {
      title: '插件ID',
      dataIndex: 'statePlugId',
      ellipsis: {
        showTitle: false,
      },
      width: 100,
    },
    {
      title: '执行记录ID',
      dataIndex: 'stateExecRecordId',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
    },
    {
      title: '状态代码',
      dataIndex: 'stateCode',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
    },
    {
      title: '响应信息',
      dataIndex: 'stateResponse',
      ellipsis: {
        showTitle: false,
      },
      render: (stateResponse) => (
        <Tooltip placement="topLeft" title={stateResponse}>
            {stateResponse}
        </Tooltip>
      ),
      width: 500,
    },
    {
      title: '创建时间',
      dataIndex: 'stateCreateTime',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
    },
    {
      title: '中间时间',
      dataIndex: 'stateMiddleTime',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
    },
    {
      title: '完成时间',
      dataIndex: 'stateFinishTime',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
    },
    {
      title: '结果类型',
      dataIndex: 'stateResultType',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
    },
  ];

  const { Dragger } = Upload;
  const DraggerProps: UploadProps = {
    name: 'files',
    multiple: false,
    // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        console.log(`${info.file.name} file upload failed.`);
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

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

  // 钩子，启动时获取插件信息列表
  useEffect(() => {
    console.log('UUIDUUIDUUIDUUID', UUID);
    apiGetPlugState(UUID).then((resp) => {
      if (resp != null) {
        setData(resp);
      }
    });
  }, []);

  /**
   * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
   */
  const showGetDetailOpen = (stateId: String) => {
    const res = data.find((item) => item.stateId == stateId);
    console.log('showGetDetailOpen', res);
    setSelectData(res);
    setGetDetailOpen(true);
  };
  // 打开新增插件信息窗口
  const showAddModal = () => {
    addFormInstance.resetFields();
    addFormInstance.setFieldsValue({
      plugCardId: UUID,
    });
    setAddModalOpen(true);
  };
  // 打开修改插件信息信息窗口
  const showUpdateModal = (record: DataType) => {
    setUpdateModalOpen(true);
    updateFormInstance.setFieldsValue({
      vmUuid: UUID,
    });
  };
  // 新增插件信息
  const submitAddModal = () => {
    const temp = addFormInstance.getFieldsValue();
    const param = {
      plugId: UUID,
      plugParamList: [
        {
          paramDefaultValue: temp.paramDefaultValue,
          paramDescription: temp.paramDescription,
          paramKey: temp.paramKey,
          paramRequire: temp.paramRequire
        }
      ]
    };
    console.log('temp Param', temp);
    apiAddPlugParam(param).then((respCode) => {
      // 如果新增成功，刷新列表
      if (respCode == 200) {
        apiGetPlugState(UUID).then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
        setAddModalOpen(false);
      }
    });
  };
  // 关闭详细信息窗口
  const cancelGetDetail = () => {
    setGetDetailOpen(false);
  };
  // 取消新增插件信息
  const cancelAddModal = () => {
    setAddModalOpen(false);
  };
  // 取消修改插件信息
  const cancelUpdateModal = () => {
    setUpdateModalOpen(false);
  };
  // 删除插件信息
  const revertSnapshot = (snapGroupUuid: string) => {
    const data = {
      snapGroupUuid: snapGroupUuid,
    };
    apiSnapshotRevert(data).then((respCode) => {
      // 如果插件信息删除成功，刷新列表
      if (respCode == 200) {
        apiGetPlugState(UUID).then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
  };
  // 删除插件信息
  const deleteSnapshot = (hostId: string) => {
    apiSnapshotDelete(hostId).then((respCode) => {
      // 如果插件信息删除成功，刷新列表
      if (respCode == 200) {
        apiGetPlugState(UUID).then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
  };
  // 删除插件
  const deleteHost = (plugId: string) => {
    apiDeletePlugParam(plugId).then((respCode) => {
      // 如果插件删除成功，刷新列表
      if (respCode == 200) {
        apiGetPlugState(UUID).then((resp) => {
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
    <>
      <Drawer
        title="新增参数"
        width={720}
        open={addModalOpen}
        onClose={cancelAddModal}
        destroyOnClose={true}
        bodyStyle={{
          paddingBottom: 80,
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
            label="参数键"
            name="paramKey"
            rules={[{ required: true, message: '请输入参数键!' }]}
          >
            <Input placeholder={'参数键'} />
          </Form.Item>
          <Form.Item
            label="参数默认值"
            name="paramDefaultValue"
            rules={[{ required: true, message: '请输入参数默认值!' }]}
          >
            <Input placeholder={'参数默认值'} />
          </Form.Item>

          <Form.Item
            label="参数描述"
            name="paramDescription"
            rules={[{ required: true, message: '请输入参数描述!' }]}
          >
            <Input placeholder={'参数描述'} />
          </Form.Item>
          <Form.Item
            label="参数是否必需"
            name="paramRequire"
            rules={[{ required: true, message: '请选择参数是否必需!' }]}
          >
            <Radio.Group>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="文件详细信息"
        open={getDetailOpen}
        onClose={cancelGetDetail}
        width={1000}
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
          title="文件列表"
          column={2}
          layout="vertical"
        />

        <PlugFiles key={selectData?.stateId} uuid={selectData?.stateId} />
      </Drawer>

      <Space size={'middle'}>
        <Button
          type="primary"
          size="large"
          icon={<RedoOutlined />}
          onClick={() =>
            apiGetPlugState(UUID).then((resp) => {
              if (resp != null) {
                setData(resp);
              }
            })
          }
        >
          刷新
        </Button>
      </Space>
      <Table
        style={{ marginTop: 15 }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey={'snapGroupUuid'}
        scroll={{ x: 1500 }}
      ></Table>
    </>
  );
};
export default ParamInfoPage;
