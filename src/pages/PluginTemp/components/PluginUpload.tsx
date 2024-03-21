/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InboxOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import type { UploadProps } from 'antd';
import { Button, Form, Input, Space, Upload, message } from 'antd';
import React from 'react';
import { apiPluginUpload } from '@/api/Plugin';

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
const PluginUpload: React.FC<HostIdProps> = (props) => {
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    console.log('values.dragger[0].originFileObj: ', values.dragger[0].originFileObj);
    console.log('values.command: ', values.command);
    // 上传文件 
    let formdata = new FormData();
    formdata.set('multipartFile', values.dragger[0].originFileObj);
    formdata.set('startCommand', values.command);
    formdata.set('plugName', values.dragger[0].name);
    formdata.set('description', values.dragger[0].name);
    console.log(formdata.get('startCommand'));
    apiPluginUpload(formdata);
  };

  const { Dragger } = Upload;

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
        console.log(`${info.file.name} file upload failed.`);
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <>
      <ProDescriptions title="插件配置"></ProDescriptions>
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          'input-number': 3,
          'checkbox-group': ['A', 'B'],
          rate: 3.5,
          'color-picker': null,
        }}
        style={{ maxWidth: 800 }}
      >
        <Form.Item
          label="插件执行命令"
          name="command"
          rules={[{ required: true, message: '输入执行的命令' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="插件">
          <Form.Item
            name="dragger"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
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
        </Form.Item>
        <Form.Item wrapperCol={{ span: 5, offset: 6 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="reset">重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default PluginUpload;
