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
import { CloudDownloadOutlined } from '@ant-design/icons';
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
import DiskInfoCard from './components/DiskInfoCard';
import ProcessInfoCard from './components/ProcessInfoCard';
import AlertInfoCard from './components/AlertInfoCard';
import ExportJsonExcel from "js-export-excel";

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
    children: <DiskInfoCard />,
  },
  {
    key: 'net',
    label: `网络`,
    children: <NetInfoCard />,
  },
  {
    key: 'process',
    label: `进程`,
    children: <ProcessInfoCard />,
  },
];

const Context = React.createContext({ name: 'Default' });
const Welcome: React.FC = () => {
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

  const downloadExcel = async () => {
    var option:any = {
      fileName:"excel",
      datas:[],
    };

    const res = await apiGetGuestInfos(UUID);
    const parsedHostDesc = JSON.parse(res.hostDesc);
    const host_desc = parsedHostDesc.host_info_stat;
    var host_desc_result = Object.entries(host_desc).reduce(function(acc, [key, value]) {
      if (key == "systemd_infos") {
        return acc;
      }
      acc.push({ "key": key, "value": value });
      return acc;
    }, []);
    console.log("host_desc", host_desc_result)

    const parsedCPUDesc = JSON.parse(res.cpuDesc);
    const cpu_basic_infos_result = parsedCPUDesc.cpu_basic_infos;
    console.log("cpu_basic_infos_result", cpu_basic_infos_result)

    const parsedMemDesc = JSON.parse(res.memDesc);
    const swap_devices_result = parsedMemDesc.swap_devices;
    console.log("swap_devices_result", swap_devices_result)

    const parsedDiskDesc = JSON.parse(res.diskDesc);
    const partition_stats_result = parsedDiskDesc.partition_stats;
    console.log('partition_stats_result: ', partition_stats_result);

    const parsedNetDesc = JSON.parse(res.netDesc);
    const interface_infos_result = parsedNetDesc.interface_infos;
    interface_infos_result.forEach(function (item, index, array) {
      item.addrs = JSON.stringify(item.addrs);
    });
    // interface_infos_result.addrs = JSON.stringify(interface_infos_result.addrs);
    console.log('interface_infos_result: ', interface_infos_result);
    const ip_route_infos_result = parsedNetDesc.ip_route_infos;
    console.log('ip_route_infos_result: ', ip_route_infos_result);

    option.datas = [
      {
        sheetData: host_desc_result,
        sheetName: "基本信息",
        sheetFilter: ["key", "value"],
        sheetHeader: ["信息名称", "信息值"],
        columnWidths: [30, 30],
      },
      {
        sheetData: host_desc.systemd_infos,
        sheetName: "自启动项",
        sheetFilter: ["name", "status"],
        sheetHeader: ["自启动项", "状态"],
        columnWidths: [30, 30],
      },
      {
        sheetData: cpu_basic_infos_result,
        sheetName: "处理器信息",
        sheetFilter: ["cpu", "vendor_id", "family", "model", "stepping", "physical_id", "core_id", "cores", "model_name", "mhz", "cache_size", "flags", "microcode"],
        sheetHeader: ["处理器标识符", "处理器制造商标识符", "处理器系列", "型号", "修订号", "物理处理器标识符", "核心标识符", "核心数", "处理器型号名称", "处理器主频/兆赫兹", "处理器缓存大小", "处理器特性", "处理器微码"],
        columnWidths: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],

      },
      {
        sheetData: swap_devices_result,
        sheetName: "交换内存信息",
        sheetFilter: ["name", "used_bytes", "free_bytes"],
        sheetHeader: ["交换空间设备名", "已用字节数", "空闲字节数"],
        columnWidths: [30, 30, 30],
      },
      {
        sheetData: partition_stats_result,
        sheetName: "磁盘分区信息",
        sheetFilter: ["device", "mountpoint", "fstype", "opts"],
        sheetHeader: ["设备名", "挂载点", "文件系统类型", "挂载选项"],
        columnWidths: [30, 30, 30, 30],
      },
      {
        sheetData: interface_infos_result,
        sheetName: "网卡配置信息",
        sheetFilter: ["index", "mtu", "name", "hardwareaddr", "flags", "addrs"],
        sheetHeader: ["网卡索引", "最大传输单元", "网卡名称", "网卡硬件地址", "网卡标志", "网卡地址"],
        columnWidths: [30, 30, 30, 30, 30, 30],
      },
      {
        sheetData: ip_route_infos_result,
        sheetName: "路由信息",
        sheetFilter: ["destination", "gateway", "genmask", "flags", "mss", "window", "irtt", "interface"],
        sheetHeader: ["目标地址", "网关地址", "子网掩码", "标志", "最大报文段长度", "窗口大小", "最大重传时间", "网卡名称"],
        columnWidths: [30, 30, 30, 30, 30, 30, 30, 30],
      },
    ];
    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); //保存
  }

  return (
    <PageContainer>
      {contextHolder}
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
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            虚拟机监控信息
            <div>
              <Button 
                      type="primary"
                      style={{
                      }}
                      size="large"
                      icon={<CloudDownloadOutlined />}
                      onClick={() => downloadExcel()}>
                      导出Excel
              </Button>
              <Button 
                      type="primary"
                      style={{
                        marginLeft: '10px',
                      }}
                      size="large"
                      icon={<CloudDownloadOutlined />}
                      onClick={() => downloadWord()}>
                      导出Word
              </Button>
              <Button 
                      type="primary"
                      style={{
                        marginLeft: '10px',
                      }}
                      size="large"
                      icon={<CloudDownloadOutlined />}
                      onClick={() => downloadPDF()}>
                      导出PDF
              </Button>
            </div>
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

      <Card
       style={{
        marginTop: '20px',
        borderRadius: 0,
      }}
      >
          <div
            style={{
              fontSize: '20px',
              marginBottom: '30px',
            }}
          >
            虚拟机告警历史
          </div>
          <AlertInfoCard uuid={UUID} />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
