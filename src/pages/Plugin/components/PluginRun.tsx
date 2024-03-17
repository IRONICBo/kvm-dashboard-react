/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  apiDeletePlugParam,
  apiGetPlugParamByPlugId,
  apiAddPlugParam,
  apiStartPlugState,
} from '@/api/Plugin';
import {
  apiInsertAllEvaluateNode,
  apiGetAllEvaluateNode,
  apiDeleteEvaluateNode,
  apiUpdateEvaluateNode,
  apiInsertEvaluateNode,
} from '@/api/PluginNode';
import { apiPluginUpload } from '@/api/Plugin';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import type { UploadProps } from 'antd';
import { Button, Form, Input, Select, Space, message, Empty, Spin, Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiGetPluginInfo, apiRunPlugin, apiGetPluginResp, apiTestPlugin } from '@/api/Plugin';
import { apiQueryVmList } from '@/api/VmManage';
import { useSearchParams } from '@umijs/max';
import { apiRefreshHostList } from '@/api/HostManage';

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
  const [UUID, setUUID] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);

    let data = {};

    // 上传文件
    const params = {
      execNumber: parseInt(values.execNumber),
      // hostUuidList: Array.isArray(values.hostUuidList) ? values.hostUuidList : [values.hostUuidList],
      // vmUuidList: Array.isArray(values.vmUuidList) ? values.vmUuidList : [values.vmUuidList],
      nodeIdList: Array.isArray(values.nodeIdList) ? values.nodeIdList : [values.nodeIdList],
      paramsJson: JSON.stringify(values.params),
      updateScriptFile: true,
      plugId: parseInt(UUID),
    };
    console.log('params', params);
    apiStartPlugState(params).then((res) => {
      console.log('apiRunPlugin', res);
      // 获取结果
      // TODO:
      if (res != undefined) {
        setPluginResult({
          hostErrorMap: JSON.stringify(res.hostErrorMap),
          vmErrorMap: JSON.stringify(res.vmErrorMap),
        });
      } else {
        message.error('插件运行失败');
      }
    });
  };

  const { Option } = Select;
  let [vmList, setVmList] = useState([]);
  let [nodeList, setNodeList] = useState([]);
  let [hostList, setHostList] = useState([]);
  let [fields, setFields] = useState([]);
  let [data, setData] = useState([]);

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
    // {
    //   value: "ping",
    //   label: "网络时延"
    // },
    // {
    //   value: "fio",
    //   label: "存储性能"
    // },
    // {
    //   value: "dbtest",
    //   label: "数据库性能测试"
    // },
    // {
    //   value: "ptp4l",
    //   label: "对时精度"
    // },
    switch (value) {
      case 'ping':
        form.setFieldsValue({ note: 'vm1' });
        break;
      case 'fio':
        form.setFieldsValue({ note: 'vm1' });
        break;
      case 'dbtest':
        form.setFieldsValue({ note: 'vm1' });
        break;
      case 'ptp4l':
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
    const uuid = searchParams.get('plugId') || '';
    console.log("PluginRun UUID:", uuid)
    setUUID(uuid);
    apiGetPlugParamByPlugId(uuid).then((resp) => {
      if (resp != null) {
        setData(resp);
        // Set form data
        // [
        //   {
        //     "paramZzid": 5,
        //     "paramPlugId": 11,
        //     "paramKey": "param",
        //     "paramDefaultValue": "123",
        //     "paramRequire": 1,
        //     "paramDescription": null
        //   }
        // ]
        const tempFields = [];
        resp.forEach((element) => {
          tempFields.push({
            key: element.paramKey,
            value: element.paramDefaultValue,
          });
        });
        form.setFieldsValue(
          {
            params: tempFields,
          }
        );
        console.log('form', form);
      }
    });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
            apiGetAllEvaluateNode().then(resp => {
              if (resp != null) {
                  const transformedData = [];
                  resp.forEach(element => {
                  console.log("transformedData", element)
                      transformedData.push(
                          {
                              "label": element.nodeName,
                              "value": element.nodeId,
                          }
                      )
                  });
                  // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
                  console.log("transformedData", transformedData)
                  setNodeList(transformedData);
              }
          })
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
        apiRefreshHostList().then(resp => {
          if (resp != null) {
              const transformedData = [];
              resp.forEach(element => {
              console.log("transformedData", element)
                  transformedData.push(
                      {
                          "label": element.hostName,
                          "value": element.hostUuid,
                      }
                  )
              });
              // let [vmList, setVmList] = useState<{ key: any; value: any; }[]>([]);
              console.log("transformedData", transformedData)
              setHostList(transformedData);
          }
      })

        console.log("setVmList", vmList);

        const tempMetricList = [
          {
            value: "ping",
            label: "网络时延"
          },
          {
            value: "fio",
            label: "存储性能"
          },
          {
            value: "dbtest",
            label: "数据库性能测试"
          },
          {
            value: "ptp4l",
            label: "对时精度"
          },
        ]
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
        <Form.Item name="execNumber" label="执行次数" rules={[{ required: false }]}>
          <Input placeholder={'1'} />
        </Form.Item>
        <Form.Item name="nodeIdList" label="测试节点" rules={[{ required: false }]}>
          <Select
            placeholder="选择一个节点并更改上面的输入"
            onChange={onNodeChange}
            allowClear
            mode="multiple"
            options={nodeList}
          >
          </Select>
        </Form.Item>
        {/* <Form.Item name="vmUuidList" label="虚拟机节点" rules={[{ required: false }]}>
          <Select
            placeholder="选择一个节点并更改上面的输入"
            onChange={onNodeChange}
            allowClear
            mode="multiple"
            options={vmList}
          >
          </Select>
        </Form.Item>
        <Form.Item name="hostUuidList" label="物理机节点" rules={[{ required: false }]}>
          <Select
            placeholder="选择一个节点并更改上面的输入"
            onChange={onNodeChange}
            allowClear
            mode="multiple"
            options={hostList}
          >
          </Select>
        </Form.Item> */}
        
        {/* <Form.Item name="plugin" label="插件" rules={[{ required: true }]}>
          <Select
            placeholder="选择一个插件并更改上面的输入"
            onChange={onNodeChange}
            allowClear
          >
            <Option value="vm1">vm1</Option>
          </Select>
          <Select
            placeholder="选择一个插件并更改上面的输入"
            showSearch
            defaultValue={metricList[0].value}
            onChange={handleMetricListChange}
            onSearch={handleMetricListChange}
            options={metricList}
          />
        </Form.Item> */}
        {/* {
            selectedMetric == 'ping'&& (
              <>
                <Form.Item name="host" label="主机地址" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="count" label="报文次数" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="size" label="报文个数" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="interval" label="报文间隔" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </>
            )
        }
        {
            selectedMetric == 'fio'&& (
              <>
                <Form.Item name="dir" label="挂载地址" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="batch" label="文件块大小" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="size" label="文件总大小" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </>
            )
        }
        {
            selectedMetric == 'dbtest' && (
              <>
                <Form.Item name="host" label="数据库地址" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="port" label="数据库端口" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="count" label="读/写/并发访问量" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </>
            )
        }
        {
            selectedMetric == 'ptp4l'&& (
              <>
                <Form.Item name="interface" label="网络接口" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </>
            )
        } */}
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

      { pluginResult == null ? <Empty /> : 
        <Card>
          <p>主机节点响应：{pluginResult.hostErrorMap}</p>
          <p>虚拟机节点响应：{pluginResult.vmErrorMap}</p>
        </Card>}
      {/* </Spin> */}
    </>
  );
};

export default PluginRun;
