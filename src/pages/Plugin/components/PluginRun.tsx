/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiPluginUpload } from '@/api/Plugin';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import type { UploadProps } from 'antd';
import { Button, Form, Input, Select, Space, message, Empty, Spin } from 'antd';
import React from 'react';

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

interface HostIdProps {
  uuid: string;
}
const PluginRun: React.FC<HostIdProps> = (props) => {
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    // 上传文件
    const formData = new FormData();
    formData.append('node', values.node);
    formData.append('params', JSON.stringify(values.params));
    apiPluginUpload(formData);
  };

  const { Option } = Select;

  const DraggerProps: UploadProps = {
    name: 'file',
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

  const [form] = Form.useForm();
  const onNodeChange = (value: string) => {
    switch (value) {
      case 'vm1':
        form.setFieldsValue({ note: 'vm1' });
        break;
    }
  };

  return (
    <>
      <ProDescriptions title="运行参数配置"></ProDescriptions>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        autoComplete="off"
        form={form}
      >
        <Form.Item name="node" label="节点" rules={[{ required: true }]}>
          <Select
            placeholder="选择一个节点并更改上面的输入"
            onChange={onNodeChange}
            allowClear
          >
            <Option value="vm1">vm1</Option>
          </Select>
        </Form.Item>
        <Form.Item name="node" label="插件" rules={[{ required: true }]}>
          <Select
            placeholder="选择一个插件并更改上面的输入"
            onChange={onNodeChange}
            allowClear
          >
            <Option value="vm1">vm1</Option>
          </Select>
        </Form.Item>
        <Form.List name="params">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'first']}
                    rules={[{ required: true, message: 'Missing first name' }]}
                  >
                    <Input placeholder="参数名" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'last']}
                    rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    <Input placeholder="参数值" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  添加参数
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>

      <ProDescriptions title="插件测试结果"></ProDescriptions>
      <Spin tip="Loading...">
        <Empty />
      </Spin>
    </>
  );
};

export default PluginRun;
