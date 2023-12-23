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
import { Button, notification } from 'antd';
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
import PluginUpload from './components/PluginUpload';
import APIInfoCard from './components/PluginResult';
import PluginRun from './components/PluginRun';
import PluginResult from './components/PluginResult';

const Context = React.createContext({ name: 'Default' });
const Performance: React.FC = () => {
  // Get UUID
  const [UUID, setUUID] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const uuid = searchParams.get('uuid') || '';
    console.log(uuid)
    setUUID(uuid);
  }, []);

  useEffect(() => {
    if (UUID === '') {
      return;
    }
    
    const random = Math.random().toString(36).slice(-8);
    const websocket = new WebSocket(
      'ws://localhost:28080/api/websocket/alarm/' +
        UUID +
        '/' +
        random,
    );
    websocket.onopen = function () {
      console.log('websocket open');
    };
    websocket.onmessage = function (msg) {
      console.log("ws://localhost:28080/api/websocket/alarm/", msg.data);
      api.warning({
        message: '报警信息：'+msg.data,
        description: '节点：' + UUID + '：' + msg.data,
        duration: 2,
      });
    };
    websocket.onclose = function () {
      console.log('websocket closed');
    };
    websocket.onerror = function () {
      console.log('websocket error');
      api.error({
        message: '报警接口连接失败',
        description: '',
        duration: 2,
      });
    };
  }, [UUID]);

  return (
    <PageContainer>
      {contextHolder}
      {/* <Card
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
          }}
        >
          <div
            style={{
              fontSize: '20px',
              marginBottom: '30px',
            }}
          >
            插件上传
          </div>
          <PluginUpload uuid={UUID} />
        </div>
      </Card> */}
      <Card
        style={{
          borderRadius: 0,
          marginTop: '30px',
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
          }}
        >
          <div
            style={{
              fontSize: '20px',
              marginBottom: '30px',
            }}
          >
            插件测试
          </div>
          <PluginRun uuid={UUID} />
        </div>
      </Card>
    </PageContainer>
  );
};

export default Performance;
