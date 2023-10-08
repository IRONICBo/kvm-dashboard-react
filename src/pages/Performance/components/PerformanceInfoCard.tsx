/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiGetGuestInfos } from '@/api/Monitor';
import { ProDescriptions } from '@ant-design/pro-components';
import { Tag } from 'antd';
import React, { useEffect, useState } from 'react';

const AGENT_INFO_CLOUMNS = [
  {
    title: '在线状态',
    key: 'isOnline',
    dataIndex: 'isOnline',
    render: (_, { isOnline }) => (
      <>
        {isOnline ? (
          <Tag color="green" key={isOnline}>
            在线
          </Tag>
        ) : (
          <Tag color="volcano" key={isOnline}>
            离线
          </Tag>
        )}
      </>
    ),
  },
  {
    title: '周期',
    key: 'period',
    dataIndex: 'period',
    render: (_, { period }) => (
      <>
        {period ? (
          <Tag color="blue" key={period}>
            {period}秒
          </Tag>
        ) : (
          <Tag color="volcano" key={period}>
            未知
          </Tag>
        )}
      </>
    ),
  },
  {
    title: '数据压缩',
    key: 'useGzip',
    dataIndex: 'useGzip',
    render: (_, { useGzip }) => (
      <>
        {useGzip ? (
          <Tag color="green" key={useGzip}>
            开启
          </Tag>
        ) : (
          <Tag color="volcano" key={useGzip}>
            关闭
          </Tag>
        )}
      </>
    ),
  },
  {
    title: '创建时间',
    key: 'createdAt',
    dataIndex: 'createdAt',
  },
  {
    title: '上次启动时间',
    key: 'updatedAt',
    dataIndex: 'updatedAt',
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

interface HostIdProps {
  uuid: string;
}
const HostInfoCard: React.FC<HostIdProps> = (props) => {
  interface AgentInfo {
    isOnline: boolean;
    useGzip: boolean;
    period: number;
    createdAt: string;
    updatedAt: string;
  }
  const UUID = props.uuid;
  const [hostInfo, setHostInfo] = useState(Object);
  const [hostDesc, setHostDesc] = useState(Object);
  const [agentInfo, setAgentInfo] = useState(Object);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiGetGuestInfos(UUID);
        const parsedHostDesc = JSON.parse(res.hostDesc);
        console.log('parsedHostDesc: ', parsedHostDesc.host_info_stat);
        setHostInfo(res);
        // Maybe some data need to be parsed
        setHostDesc(parsedHostDesc.host_info_stat);

        const tempAgentInfo: AgentInfo = {
          isOnline: res.isOnline == 1,
          useGzip: res.useGzip == 1,
          period: res.period,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
        };
        setAgentInfo(tempAgentInfo);
      } catch (error) {
        console.error('Error retrieving guest infos:', error);
      }
    };

    fetchData();
  }, [UUID]);

  console.log('hostInfo: ', hostInfo);
  console.log('agentInfo: ', agentInfo);

  return (
    <>
      <ProDescriptions
        title="基本性能信息"
        dataSource={hostDesc}
        columns={Performace_INFO_CLOUMNS}
      ></ProDescriptions>
    </>
  );
};


export default HostInfoCard;