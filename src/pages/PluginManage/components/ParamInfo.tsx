import {
  apiDeletePlugParam,
  apiGetPlugParamByPlugId,
  apiAddPlugParam,
} from '@/api/Plugin';
import { apiSnapshotDelete, apiSnapshotRevert } from '@/api/VmSnapshot';
import { InboxOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {
  Button,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Radio,
  Space,
  Table,
  Upload,
  message,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

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
      title: '参数ID',
      dataIndex: 'paramZzid',
      ellipsis: {
        showTitle: false,
      },
      width: 100,
    },
    {
      title: '插件ID',
      dataIndex: 'paramPlugId',
      ellipsis: {
        showTitle: false,
      },
      width: 100,
    },
    {
      title: '参数键',
      dataIndex: 'paramKey',
      ellipsis: {
        showTitle: false,
      },
      width: 100,
    },
    {
      title: '参数默认值',
      dataIndex: 'paramDefaultValue',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
    },
    {
      title: '参数是否必需',
      dataIndex: 'paramRequire',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
      render: (text, record) => {
        return record.paramRequire == 1 ? '是' : '否';
      }
    },
    {
      title: '参数描述',
      dataIndex: 'paramDescription',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          {/* <Button
            size={'small'}
            shape={'round'}
            type="dashed"
            onClick={() => showUpdateModal(record)}
          >
            编辑
          </Button> */}
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deleteHost(record.plugZzid)}
          >
            <Button size={'small'} shape={'round'} danger={true} type="dashed">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const { Dragger } = Upload;
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
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
        message.error(`${info.file.name} file upload failed.`);
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
    apiGetPlugParamByPlugId(UUID).then((resp) => {
      if (resp != null) {
        setData(resp);
      }
    });
  }, []);

  /**
   * ----------------------------------------------------------------------------------------------------------------------------------------------------------------
   */
  const showGetDetailOpen = (plugZzid: String) => {
    const res = data.find((item) => item.plugZzid == plugZzid);
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
        apiGetPlugParamByPlugId(UUID).then((resp) => {
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
        apiGetPlugParamByPlugId(UUID).then((resp) => {
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
        apiGetPlugParamByPlugId(UUID).then((resp) => {
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
        apiGetPlugParamByPlugId(UUID).then((resp) => {
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

      <Space size={'middle'}>
        <Button
          type="primary"
          size="large"
          icon={<RedoOutlined />}
          onClick={() =>
            apiGetPlugParamByPlugId(UUID).then((resp) => {
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
          新增参数
        </Button>
      </Space>
      <Table
        style={{ marginTop: 15 }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey={'snapGroupUuid'}
        scroll={{ x: 1000 }}
      ></Table>
    </>
  );
};
export default ParamInfoPage;
