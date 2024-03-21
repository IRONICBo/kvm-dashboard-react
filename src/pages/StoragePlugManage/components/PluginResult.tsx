/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InboxOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import type { UploadProps } from 'antd';
import { Button, Form, Input, Space, Upload, message, Empty } from 'antd';
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
const PluginResult: React.FC<HostIdProps> = (props) => {
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    // 上传文件
    const formData = new FormData();
    formData.append('file', values.dragger[0].originFileObj);
    formData.append('command', values.command);
    // formData.append('uuid', props.uuid);
    apiPluginUpload(formData);
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
      <ProDescriptions title="插件测试结果"></ProDescriptions>
      <Empty />
    </>
  );
};

export default PluginResult;
