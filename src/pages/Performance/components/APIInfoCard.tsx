/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiGetEvaluateData } from '@/api/Monitor';
import { ProDescriptions } from '@ant-design/pro-components';
import { Tag, Table } from 'antd';
import React, { useEffect, useState } from 'react';

const API_INFO_CLOUMNS = [
  {
    title: '接口',
    key: 'name',
    dataIndex: 'name',
    render: (_, { name }) => (
      <>
        {name}
      </>
    ),
  },
  {
    title: '接口最优响应速度',
    key: 'fastestTime',
    dataIndex: 'fastestTime',
    render: (_, { fastestTime }) => (
      <>
          <Tag color="green" key={fastestTime}>
            {fastestTime} ms
          </Tag>
      </>
    ),
  },
  {
    title: '接口最差响应速度',
    key: 'slowestTime',
    dataIndex: 'slowestTime',
    render: (_, { slowestTime }) => (
      <>
          <Tag color="orange" key={slowestTime}>
            {slowestTime} ms
          </Tag>
      </>
    ),
  },
  {
    title: '服务器失败次数',
    key: 'totalErrorByServer',
    dataIndex: 'totalErrorByServer',
    render: (_, { totalErrorByServer }) => (
      <>
          <Tag color="orange" key={totalErrorByServer}>
            {totalErrorByServer} 次
          </Tag>
      </>
    ),
  },
  {
    title: '用户失败次数',
    key: 'totalErrorByUser',
    dataIndex: 'totalErrorByUser',
    render: (_, { totalErrorByUser }) => (
      <>
          <Tag color="orange" key={totalErrorByUser}>
            {totalErrorByUser} 次
          </Tag>
      </>
    ),
  },
  {
    title: '总请求次数',
    key: 'totalRequestNum',
    dataIndex: 'totalRequestNum',
    render: (_, { totalRequestNum }) => (
      <>
          <Tag color="gray" key={totalRequestNum}>
            {totalRequestNum} 次
          </Tag>
      </>
    ),
  },
  {
    title: '总成功次数',
    key: 'totalSuccessNum',
    dataIndex: 'totalSuccessNum',
    render: (_, { totalSuccessNum }) => (
      <>
          <Tag color="green" key={totalSuccessNum}>
            {totalSuccessNum} 次
          </Tag>
      </>
    ),
  },
  {
    title: '总耗时',
    key: 'totalTime',
    dataIndex: 'totalTime',
    render: (_, { totalTime }) => (
      <>
          <Tag color="green" key={totalTime}>
            {totalTime} ms
          </Tag>
      </>
    ),
  },
];

const Performace_INFO_CLOUMNS = [
  {
    title: '接口耗时',
    key: 'hostname',
    dataIndex: 'hostname',
  },
  {
    title: '接口数',
    key: 'procs',
    dataIndex: 'procs',
  },
  {
    title: '虚拟机创建耗时',
    key: 'os',
    dataIndex: 'os',
  },
  {
    title: '虚拟机创建数',
    key: 'platform',
    dataIndex: 'platform',
  },
  {
    title: '虚拟机迁移速度',
    key: 'platform_family',
    dataIndex: 'platform_family',
  },
  {
    title: '接口成功率',
    key: 'platform_version',
    dataIndex: 'platform_version',
  },
  {
    title: '接口失败率',
    key: 'kernel_version',
    dataIndex: 'kernel_version',
  },
];

const EVALUATE_DTO_CLOUMNS = [
  {
    title: '接口总耗时',
    key: 'threadTotalExec',
    dataIndex: 'threadTotalExec',
    render: (_, { threadTotalExec }) => (
      <>
        <Tag>{threadTotalExec}ms</Tag>
      </>
    ),
  },
  {
    title: '接口成功耗时',
    key: 'threadSuccessExec',
    dataIndex: 'threadSuccessExec',
    render: (_, { threadSuccessExec }) => (
      <>
        <Tag>{threadSuccessExec}ms</Tag>
      </>
    ),
  },
  {
    title: '接口失败耗时',
    key: 'threadErrorExec',
    dataIndex: 'threadErrorExec',
    render: (_, { threadErrorExec }) => (
      <>
        <Tag>{threadErrorExec}ms</Tag>
      </>
    ),
  },
]

const ALL_EVALUATE_DTO_CLOUMNS = [
  {
    title: '接口总耗时',
    key: 'threadTotalExec',
    dataIndex: 'threadTotalExec',
    render: (_, { threadTotalExec }) => (
      <>
        <Tag>{threadTotalExec}ms</Tag>
      </>
    ),
  },
  {
    title: '接口成功耗时',
    key: 'threadSuccessExec',
    dataIndex: 'threadSuccessExec',
    render: (_, { threadSuccessExec }) => (
      <>
        <Tag>{threadSuccessExec}ms</Tag>
      </>
    ),
  },
  {
    title: '接口失败耗时',
    key: 'threadErrorExec',
    dataIndex: 'threadErrorExec',
    render: (_, { threadErrorExec }) => (
      <>
        <Tag>{threadErrorExec}ms</Tag>
      </>
    ),
  },
  {
    title: '总调用次数',
    key: 'totalRequestNum',
    dataIndex: 'totalRequestNum',
    render: (_, { totalRequestNum }) => (
      <>
        <Tag>{totalRequestNum}</Tag>
      </>
    ),
  },
  {
    title: '接口成功总次数',
    key: 'totalSuccessNum',
    dataIndex: 'totalSuccessNum',
    render: (_, { totalSuccessNum }) => (
      <>
        <Tag>{totalSuccessNum}</Tag>
      </>
    ),
  },
  {
    title: '用户调用接口失败次数',
    key: 'totalErrorByUser',
    dataIndex: 'totalErrorByUser',
    render: (_, { totalErrorByUser }) => (
      <>
        <Tag>{totalErrorByUser}</Tag>
      </>
    ),
  },
  {
    title: '服务器接口失败次数',
    key: 'totalErrorByServer',
    dataIndex: 'totalErrorByServer',
    render: (_, { totalErrorByServer }) => (
      <>
        <Tag>{totalErrorByServer}</Tag>
      </>
    ),
  },
]

interface HostIdProps {
  uuid: string;
}
const APIInfoCard: React.FC<HostIdProps> = (props) => {
  interface AgentInfo {
    isOnline: boolean;
    useGzip: boolean;
    period: number;
    createdAt: string;
    updatedAt: string;
  }
  const UUID = props.uuid;
  const [performaceInfo, setPerformanceInfo] = useState(Object);
  const [apiInfo, setAPIInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiGetEvaluateData();
        console.log('getEvaluateData res: ', res);
        setPerformanceInfo(res);
        // Maybe some data need to be parsed

        let interfaceInfoMap = res.interfaceInfoMap;
        let transformedObject = []; 

        for (const key in interfaceInfoMap) {
          if (interfaceInfoMap.hasOwnProperty(key)) {
            const value = interfaceInfoMap[key];
            transformedObject = transformedObject.concat({
              name: key,
              ...value
            });
          }
        }

        setAPIInfo(transformedObject);
        console.log('transformedObject: ', transformedObject);
        console.log('performaceInfo: ', performaceInfo);
        console.log('apiInfo: ', apiInfo);
      } catch (error) {
        console.error('Error retrieving guest infos:', error);
      }
    };

    fetchData();
  }, [UUID]);

  return (
    <>
      {apiInfo.length !== 0 && (
        <Table columns={API_INFO_CLOUMNS} dataSource={apiInfo} />
      )}
    </>
  );
};


export default APIInfoCard;