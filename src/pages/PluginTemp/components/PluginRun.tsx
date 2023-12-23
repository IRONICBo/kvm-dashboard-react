/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiPluginUpload } from '@/api/Plugin';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import type { UploadProps } from 'antd';
import { Button, Form, Input, Select, Space, message, Empty, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiGetPluginInfo, apiRunPlugin, apiGetPluginResp } from '@/api/Plugin';
import { apiQueryVmList } from '@/api/VmManage';

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
    const params = {
      "plugId": selectedMetric,
      "paramJson": JSON.stringify(values.params),
    }
    console.log('plugId', selectedMetric);
    console.log('paramJson', JSON.stringify(values.params));
    apiRunPlugin(params).then((res) => {
      console.log('apiRunPlugin', res);
      // 获取结果
      const res2 = apiGetPluginResp(res).then((res2) => {
        console.log('apiGetPluginResp', res2);
        setPluginResult(res2);
      });
    });

  };

  const { Option } = Select;
  let [vmList, setVmList] = useState([]);

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

  const [metricList, setMetricList] = useState([
    { key: '请选择', value: '请选择' },
  ]);
  const [selectedMetric, setSelectedMetric] = useState(
    'netstat',
  );
  const [pluginResult, setPluginResult] = useState();
  const handleMetricListChange = (value: string) => {
    console.log(`selected ${value}`);
    setSelectedMetric(value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        apiQueryVmList().then(resp => {
          if (resp != null) {
              const transformedData = [];
              resp.forEach(element => {
              console.log("transformedData", element)
                  transformedData.push(
                      {
                          "label": element.vmName,
                          "value": element.vmUuid,
                      }
                  )
              });
              // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
              console.log("transformedData", transformedData)
              setVmList(transformedData);
          }
      })
      console.log("setVmList", vmList);

        let res = await apiGetPluginInfo();
        console.log('apiGetPluginInfo : ', res);

        const deletedIndex = res.indexOf('net_stat.connection_stats');
        if (deletedIndex > -1) {
          res.splice(deletedIndex, 1);
        }

        console.log('res', res);
        const tempMetricList = res.map((item) => {
          return {
            value: item.plugZzid,
            label: item.plugName,
          };
        });
        setMetricList(tempMetricList);
        // set default metric
        setSelectedMetric(tempMetricList[0].value);
        console.log('metricList : ', tempMetricList);
      } catch (error) {
        console.error('Error retrieving guest infos:', error);
      }
    };
    fetchData();
  }, [1]);

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
            options={vmList}
          >
          </Select>
        </Form.Item>
        <Form.Item name="plugin" label="插件" rules={[{ required: true }]}>
          {/* <Select
            placeholder="选择一个插件并更改上面的输入"
            onChange={onNodeChange}
            allowClear
          >
            <Option value="vm1">vm1</Option>
          </Select> */}
          <Select
            placeholder="选择一个插件并更改上面的输入"
            showSearch
            defaultValue={metricList[0].value}
            onChange={handleMetricListChange}
            onSearch={handleMetricListChange}
            options={metricList}
          />
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
                    name={[name, 'key']}
                    rules={[{ required: true, message: '请填写键名称' }]}
                  >
                    <Input placeholder="参数名" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                    rules={[{ required: true, message: '请填写值的名称' }]}
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
            运行
          </Button>
        </Form.Item>
      </Form>

      <ProDescriptions title="插件测试结果"></ProDescriptions>

      {/* <Spin tip="Loading..."> */}

      { pluginResult == null ? <Empty /> : <pre>{pluginResult}</pre> }
      {/* </Spin> */}
    </>
  );
};

export default PluginRun;
