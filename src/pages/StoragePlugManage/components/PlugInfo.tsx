import { apiDeletePlugInfo, apiGetPlugInfoByCardId, apiAddPlugInfo } from '@/api/Plugin';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import {
  apiSnapshotCreate,
  apiSnapshotDelete,
  apiSnapshotRevert,
} from '@/api/VmSnapshot';
import { PlusOutlined, RedoOutlined, InboxOutlined } from '@ant-design/icons';
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
import type { UploadProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import ParamInfoPage from './ParamInfo';

interface DataType {
  snapGroupUuid: string;
  snapGroupName: string;
}

interface HostIdProps {
  uuid: string;
}
const PlugInfoPage: React.FC<HostIdProps> = (props) => {
  const UUID = props.uuid;
  console.log('UUID', UUID);
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'plugZzid',
      ellipsis: {
        showTitle: false,
      },
      width: 50,
      fixed: 'left',
      render: (plugZzid: string) => (
        <a
            onClick={(event) => {
              event.preventDefault();
              showGetDetailOpen(plugZzid);
            // setSelectData(data.find((item) => item.plugZzid === plugZzid));
          }}
        >
          {plugZzid}
        </a>
      ),
    },
    {
      title: '插件卡片ID',
      dataIndex: 'plugCardId',
      ellipsis: {
        showTitle: false,
      },
      width: 100,
    },
    {
      title: '插件版本',
      dataIndex: 'plugVersion',
      ellipsis: {
        showTitle: false,
      },
      width: 100,
    },
    {
      title: '插件版本名称',
      dataIndex: 'plugVersionName',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
    },
    {
      title: '插件版本描述',
      dataIndex: 'plugVersionDescription',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
    },
    {
      title: '插件脚本大小',
      dataIndex: 'plugScriptSize',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
    },
    {
      title: '插件脚本数量',
      dataIndex: 'plugScriptNumber',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
    },
    {
      title: '插件脚本路径',
      dataIndex: 'plugScriptPath',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
    },
    {
      title: '插件启动命令',
      dataIndex: 'plugStartCommand',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
    },
    {
      title: '插件是否启用',
      dataIndex: 'plugEnable',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
    },
    {
      title: '插件创建时间',
      dataIndex: 'plugCreateTime',
      ellipsis: {
        showTitle: false,
      },
      width: 200,
    },
    {
      title: '插件类型',
      dataIndex: 'plugType',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
    },
    {
      title: '插件结果类型',
      dataIndex: 'plugResultType',
      ellipsis: {
        showTitle: false,
      },
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 220,
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
          <Button size={'small'} shape={'round'}
          onClick={() => {
              window.open('/plugin/runner?plugId=' + record.plugZzid);
          }}
          >
              运行
          </Button>
          <Button size={'small'} shape={'round'}
          onClick={() => {
              window.open('/plugin/history?plugId=' + record.plugZzid);
          }}
          >
              历史
          </Button>
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
    apiGetPlugInfoByCardId(UUID).then((resp) => {
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
    // temp.files = temp.files[0].originFileObj;
    const originFiles = temp.files.map((file: any) => file.originFileObj);
    temp.files = originFiles;
    const formData = new FormData();
    Object.keys(temp).forEach(key => {
        if (Array.isArray(temp[key])) {
            // directly append the key and value to FormData
            temp[key].forEach(item => {
                formData.append(key, item);
            });
        } else {
            formData.append(key, temp[key]);
          }
    });

    apiAddPlugInfo(formData).then((respCode) => {
      // 如果新增成功，刷新列表
      if (respCode == 200) {
        apiGetPlugInfoByCardId(UUID).then((resp) => {
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
        apiGetPlugInfoByCardId(UUID).then((resp) => {
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
        apiGetPlugInfoByCardId(UUID).then((resp) => {
          if (resp != null) {
            setData(resp);
          }
        });
      }
    });
  };
  // 删除插件
  const deleteHost = (plugId: string) => {
    apiDeletePlugInfo(plugId).then((respCode) => {
      // 如果插件删除成功，刷新列表
      if (respCode == 200) {
        apiGetPlugInfoByCardId(UUID).then((resp) => {
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
        title="新增插件信息"
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
            label="插件卡片ID"
            name="plugCardId"
            rules={[{ required: true, message: '请输入插件卡片ID!' }]}
          >
            <Input disabled={true} />
          </Form.Item>

          <Form.Item
            label="插件"
            name="files"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请输入插件信息名称!' }]}
          >
            <Dragger {...DraggerProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖动文件上传</p>
              <p className="ant-upload-hint">
                支持单次或批量上传。严禁上传公司数据或其他 违禁文件。
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            label="插件结果类型"
            name="plugResultType"
            rules={[{ required: true, message: '请输入插件结果类型!' }]}
          >
            <Radio.Group>
              <Radio value={'TEXT'}>文本</Radio>
              <Radio value={'FILE'}>文件</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="插件启动命令"
            name="plugStartCommand"
            rules={[{ required: true, message: '请输入插件启动命令!' }]}
          >
            <Input placeholder={'插件启动命令'} />
          </Form.Item>

          <Form.Item
            label="插件类型"
            name="plugType"
            rules={[{ required: true, message: '请输入插件类型!' }]}
          >
            <Radio.Group>
              <Radio value={'COMMAND_PARAM'}>命令行</Radio>
              <Radio value={'HTTP_PARAM'}>接口请求</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="插件版本描述"
            name="plugVersionDescription"
            rules={[{ required: true, message: '请输入插件版本描述!' }]}
          >
            <Input placeholder={'插件版本描述'} />
          </Form.Item>

          <Form.Item
            label="插件版本名称"
            name="plugVersionName"
            rules={[{ required: true, message: '请输入插件版本名称!' }]}
          >
            <Input placeholder={'插件版本名称'} />
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="参数详细信息"
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
          title="参数列表"
          column={2}
          layout="vertical"
        />

        <ParamInfoPage key={selectData?.plugZzid} uuid={selectData?.plugZzid} />
      </Drawer>

      <Space size={'middle'}>
        <Button
          type="primary"
          size="large"
          icon={<RedoOutlined />}
          onClick={() =>
            apiGetPlugInfoByCardId(UUID).then((resp) => {
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
          新增插件版本
        </Button>
      </Space>
      <Table
        style={{ marginTop: 15 }}
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey={'snapGroupUuid'}
        scroll={{ x: 1000 }}
      ></Table>
    </>
  );
};
export default PlugInfoPage;
