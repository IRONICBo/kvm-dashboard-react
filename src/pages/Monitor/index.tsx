/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  apiGetCacheData,
  apiGetGuestInfos,
  apiGetKeySet,
  apiGetMetricAgg,
  apiGetMetricPage,
} from '@/api/Monitor';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import type { TabsProps } from 'antd';
import {
  Card,
  Col,
  DatePicker,
  Radio,
  Row,
  Select,
  Table,
  Tabs,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import HostInfoCard from './components/HostInfoCard';
import NetInfoCard from './components/NetInfoCard';
import CPUInfoCard from './components/CPUInfoCard';
import MemInfoCard from './components/MemInfoCard';

const onChange = (key: string) => {
  console.log(key);
};

const TAB_ITEMS: TabsProps['items'] = [
  {
    key: 'cpu',
    label: `处理器`,
    children: <CPUInfoCard />,
  },
  {
    key: 'mem',
    label: `内存`,
    children: <MemInfoCard />,
  },
  {
    key: 'disk',
    label: `磁盘`,
    children: `TODO`,
  },
  {
    key: 'net',
    label: `网络`,
    children: <NetInfoCard />,
  },
  {
    key: 'process',
    label: `进程`,
    children: `TODO`,
  },
];

const Welcome: React.FC = () => {
  // Get UUID
  const [UUID, setUUID] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const uuid = searchParams.get('uuid') || '';
    setUUID(uuid);
  }, []);

  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 0,
        }}
        bodyStyle={{
          backgroundImage:
            'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              marginBottom: '30px',
            }}
          >
            虚拟机监控信息
          </div>
          <HostInfoCard uuid={UUID} />
        </div>
      </Card>

      <Card
        style={{
          marginTop: '20px',
          borderRadius: 0,
        }}
      >
        <Tabs defaultActiveKey="net" items={TAB_ITEMS} onChange={onChange} />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
